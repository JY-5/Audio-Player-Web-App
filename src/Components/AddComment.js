import React, { useEffect, useState }  from 'react';
import { createComment } from "../services";

export const AddComment = (props) => {
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);

    function handleChangeUsername(e) {
        setUsername(e.target.value);
    }

    function handleChangeComment(e) {
        if (timestamp === "") {
            const time = props.wavesurferObject.getCurrentTime();
            setTimestamp(time);
            const minuteInput = Math.floor(time / 60);
            setMinute(minuteInput);
            const secondInput = Math.floor(time % 60);
            setSecond(secondInput);
        } 
        setComment(e.target.value);
    }

    function handleChangeMinute(e) {
        const minuteInput = parseInt(e.target.value);
        setMinute(minuteInput);
        let newTimestamp = minuteInput * 60 + second;
        // If user enter a timestamp that is longer than the audio, 
        // we by default change that to the end of the audio
        const maxMinute = Math.floor(props.duration / 60);
        const maxSecond = Math.floor(props.duration % 60);
        if (newTimestamp > props.duration) {
            setMinute(maxMinute);
            setSecond(maxSecond);
            newTimestamp = props.duration;
        }
        setTimestamp(newTimestamp);
    }

    function handleChangeSecond(e) {
        const secondInput = parseInt(e.target.value);
        setSecond(secondInput);
        let newTimestamp = minute * 60 + secondInput;
        const maxMinute = Math.floor(props.duration / 60);
        const maxSecond = Math.floor(props.duration % 60);
        if (newTimestamp > props.duration) {
            setMinute(maxMinute);
            setSecond(maxSecond);
            newTimestamp = props.duration;
        }
        setTimestamp(newTimestamp);
    }

    useEffect(() => {
        if (timestamp !== "") {
            props.wavesurferObject.on("seek", function(progress) {
                const time = props.wavesurferObject.getDuration() * progress;
                setTimestamp(time);
                const minuteInput = Math.floor(time / 60);
                setMinute(minuteInput);
                const secondInput = Math.floor(time % 60);
                setSecond(secondInput);
            });
        }
    })

    function handleSubmitComment(e) {
        createComment(username, comment, timestamp)
        .then(() => {
            setUsername("");
            setComment("");
            setTimestamp("")
            props.fetchComments();
        })
        .catch( err => {
            console.log("error sending comment", err);
        });
    }

    return (
        <div className="add-comment-panel">
            <input type="text" value={username} onChange={handleChangeUsername} className="username" placeholder="Username"/>
            <input type="text" value={comment} onChange={handleChangeComment} className="comment" placeholder="Write a comment"/>
            <span> at </span>
            <input type="text" value={minute} onChange={handleChangeMinute} placeholder="Minute" />
            <span> : </span>
            <input type="text" value={second} onChange={handleChangeSecond} placeholder="Second" />
            <input type="submit" value="Post" onClick={handleSubmitComment} className="post"/>
        </div>
    )
}

export default AddComment