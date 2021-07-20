import React, { useEffect, useState }  from 'react';
import { createComment } from "../services";

export const AddComment = (props) => {
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const maxMinute = Math.floor(props.duration / 60);
    const maxSecond = Math.floor(props.duration % 60);
    const [status, setStatus] = useState();

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
        let minuteInput = parseInt(e.target.value);
        if ((typeof minuteInput) !== 'number') {
            minuteInput = 0;
            setMinute(0);
        } else {
            setMinute(minuteInput);
        }
    
        let newTimestamp = minuteInput * 60 + second;
        // If user enter a timestamp that is longer than the audio, 
        // we by default change that to the end of the audio
        if (newTimestamp > props.duration) {
            setMinute(maxMinute);
            setSecond(maxSecond);
            newTimestamp = props.duration;
        }
        setTimestamp(newTimestamp);
    }

    function handleChangeSecond(e) {
        let secondInput = parseInt(e.target.value);

        if ((typeof secondInput) !== 'number') {
            secondInput = 0;
            setSecond(0);
        } else {
            setSecond(secondInput);
        }
        
        let newTimestamp = minute * 60 + secondInput;
        if (newTimestamp > props.duration) {
            setMinute(maxMinute);
            setSecond(maxSecond);
            newTimestamp = props.duration;
        }
        setTimestamp(newTimestamp);
    }

    function handleSubmitComment(e) {
        createComment(username, comment, timestamp)
        .then(() => {
            setUsername("");
            setComment("");
            setSecond(0);
            setMinute(0);
            setTimestamp("");
            setStatus('Success!');
            props.fetchComments();
        })
        .catch( err => {
            setStatus(err.error);
        });
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
    }, [timestamp, props.wavesurferObject])

    return (
        <div className="add-comment-panel">
            <input type="text" value={username} onChange={handleChangeUsername} className="username" placeholder="Username" />
            <input type="text" value={comment} onChange={handleChangeComment} className="comment" placeholder="Write a comment" />
            <span> at </span>
            <input type="number" min="0" max="59" value={minute} onChange={handleChangeMinute} placeholder="Minute" />
            <span> : </span>
            <input type="number" min="0" max="59" value={second} onChange={handleChangeSecond} placeholder="Second" />
            <input type="submit" value="Post" onClick={handleSubmitComment} className="post"/>
            <div>{status}</div>
        </div>
    )
}

export default AddComment