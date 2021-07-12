import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from "wavesurfer.js";
import { createComment } from "../services";

export const Player = (props) => {
    const [playing, setPlaying] = useState(false);
    const [wavesurferObject, setWavesurferObject] = useState();
    const [duration, setDuration] = useState();
    const waveformRef = useRef();
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [timestamp, setTimestamp] = useState("");
    
    //const [commentInfo, setCommentInfo] = useState({ username: "", comment: "", timestamp: ""});
    function handleChangeUsername(e) {
        setUsername(e.target.value);
    }

    function handleChangeComment(e) {
        if (timestamp === "") {
            const time = wavesurferObject.getCurrentTime();
            console.log("timestamp", time);
            setTimestamp(time);
        } 
        setComment(e.target.value);
    }


    useEffect(() => {
        if(waveformRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'violet',
                progressColor: 'purple',
                barWidth: 2,
                height: 400,
                cursorColor: 'transparent',
                closeAudioContext: true,
                responsive: true,
            });
            setWavesurferObject(wavesurfer);
            setDuration(wavesurfer.getDuration());
            wavesurfer.load('514386__kevin-manickam__relaxation-sound.wav');
            wavesurfer.on("ready", function() {
                wavesurfer.setVolume(0.5);
                //wavesurfer.play();
            });
            return () => this ? this.wavesurfer.current.destroy() : null;
        }
    }, []);

    useEffect(() => {
        if (timestamp !== "") {
            wavesurferObject.on("seek", function(progress) {
                const time = wavesurferObject.getDuration() * progress;
                setTimestamp(time);
                console.log("timestamp after seeking", time);
            });
        }
    })

    function handlePlay() {
        if (playing) {
            wavesurferObject.pause();
            console.log("pause");
        } else {
            wavesurferObject.play();
            console.log("play");

        }
        setPlaying(!playing);
    }

    function handleSubmitComment(e) {
        e.preventDefault();


        createComment(username, comment, timestamp)
        .then(() => {
            console.log("success");
            setUsername("");
            setComment("");
            setTimestamp("")
            props.fetchComments();
        })
        .catch( err => {
            console.log("error sending comment");
            //setStatus(err.error);
            //setIsPending(false);
        });
    }


    return (
        <div className="">
            <div className="player-panel">
                <div>
                    <div className="audio-info">
                        <div className="info">
                            <p className="artist">Kevin Manickam</p>
                            <p>Relaxation Music</p>
                        </div>
                        <button onClick={handlePlay} >
                            {!playing ? '▶' : '■'}
                        </button>
                    </div>
                    <div className="waveform" ref={waveformRef}></div>
                    <div>
                        {props.timelineComments ? props.timelineComments.map((comment) => {
                            return (
                                <>
                                    <button className="initial">
                                        {comment.username.charAt(0)}
                                    </button>
                                    <p className="timeline-comment">{comment.comment}</p>
                                </>
                            )
                        }) : null}
                    </div>
                </div>
                <div>
                    <img className="audio-image" src="https://i.ytimg.com/vi/6lt2JfJdGSY/maxresdefault.jpg" alt=""/>
                </div>
            </div>
            <form>
                <input type="text" value={username} onChange={handleChangeUsername} placeholder="Username"/>
                <input type="text" value={comment} onChange={handleChangeComment} placeholder="Write a comment"/>
                <input type="submit" value="Post" onClick={handleSubmitComment}/>
            </form>
        </div>
    )
    
}