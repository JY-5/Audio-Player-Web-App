import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from "wavesurfer.js";
import { createComment } from "../services";
import 'font-awesome/css/font-awesome.min.css';

export const Player = (props) => {
    const [playing, setPlaying] = useState(false);
    const [wavesurferObject, setWavesurferObject] = useState();
    const [duration, setDuration] = useState();
    const waveformRef = useRef();
    const canvasRef = useRef();
    const timelineCommentRef = useRef();
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
            const time = wavesurferObject.getCurrentTime();
            console.log("timestamp", time);
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
        const newTimestamp = minuteInput * 60 + second;
        setTimestamp(newTimestamp);
    }

    function handleChangeSecond(e) {
        const secondInput = parseInt(e.target.value);
        setSecond(secondInput);
        const newTimestamp = minute * 60 + secondInput;
        setTimestamp(newTimestamp);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const width = fitToContainer(canvas);
        const ctx = canvas.getContext('2d');

        if (props.timelineComments) {
            for (let comment of props.timelineComments) {
                const img = new Image();
                img.src = comment.avatar;
                img.alt = "";
                img.className = comment.timestamp;
                img.onload = function() {
                    console.log("load done", img.src);
                    console.log("duration", duration)
                    const x = comment.timestamp / duration * width;
                    ctx.drawImage(img, x, 0);
                }
            }
            /*canvas.addEventListener("mouseenter", (e) => {
                e.stopPropagation();
                const text = props.timelineComments[e.target.className];
                timelineCommentRef.current.innerText = text;
            });
            canvas.addEventListener("mouseleave", (e) => {
                timelineCommentRef.current.innerText = "";
            });*/
        } 
    })

    function fitToContainer(canvas){
        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='5%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        return canvas.width;
      }

    useEffect(() => {
        if(waveformRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'white',
                progressColor: '#FF8000',
                barWidth: 2,
                height: 400,
                cursorColor: 'transparent',
                closeAudioContext: true,
                responsive: true,
            });
            setWavesurferObject(wavesurfer);
            wavesurfer.load('514386__kevin-manickam__relaxation-sound.wav');
            wavesurfer.on("ready", function() {
                const durationData = parseInt(wavesurfer.getDuration());
                setDuration(durationData);
                wavesurfer.setVolume(0.5);
            });
            return () => this ? this.wavesurfer.current.destroy() : null;
        }
    }, []);

    useEffect(() => {
        if (timestamp !== "") {
            wavesurferObject.on("seek", function(progress) {
                const time = wavesurferObject.getDuration() * progress;
                setTimestamp(time);
                const minuteInput = Math.floor(time / 60);
                setMinute(minuteInput);
                const secondInput = Math.floor(time % 60);
                setSecond(secondInput);
            });
        }
    })

    function handlePlay() {
        if (playing) {
            wavesurferObject.pause();
        } else {
            wavesurferObject.play();
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
                            <p className="audio-name">Relaxation Music</p>
                        </div>
                        {!playing ?
                        <i className="fa fa-play-circle-o" onClick={handlePlay}></i>
                            :
                        <i className="fa fa-pause-circle-o" onClick={handlePlay}></i>
                        }
                    </div>
                    <div className="canvas-panel">                 
                        <div className="waveform" ref={waveformRef}></div>
                        <canvas className="canvas" ref={canvasRef} width="50rem" height="1rem">
                        </canvas>
                    </div>

                </div>
                <div className="audio-image-panel">
                    <img className="audio-image" src="https://i.ytimg.com/vi/6lt2JfJdGSY/maxresdefault.jpg" alt=""/>
                </div>
            </div>
            <p className="timeline-comment" ref={timelineCommentRef}></p>
            <div className="add-comment-panel">
                <input type="text" value={username} onChange={handleChangeUsername} className="username" placeholder="Username"/>
                <input type="text" value={comment} onChange={handleChangeComment} className="comment" placeholder="Write a comment"/>
                <span> at </span>
                <input type="text" value={minute} onChange={handleChangeMinute} placeholder="Minute" />
                <span> : </span>
                <input type="text" value={second} onChange={handleChangeSecond} placeholder="Second" />
                <input type="submit" value="Post" onClick={handleSubmitComment} className="post"/>
            </div>
        </div>
    )
    
}