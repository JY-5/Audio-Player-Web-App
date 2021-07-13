import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from "wavesurfer.js";
import { createComment } from "../services";

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
        const canvas = canvasRef.current;
        const width = fitToContainer(canvas);

        const ctx = canvas.getContext('2d');

        //ctx.drawImage(img, 100, 100);
        if (props.timelineComments) {
            console.log("props.timelineComments", props.timelineComments);
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
            canvas.addEventListener("mouseenter", (e) => {
                console.log("mouse over")
                e.stopPropagation();

                const text = props.timelineComments[e.target.className];
                console.log("e.target.className", e.target.className)
                console.log("text", text)
                /*const box = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - box.left) * canvas.width / box.width
                const mouseY = (e.clientY - box.top) * canvas.height / box.height
                ctx.strokeText(text, mouseX, 50);*/
                timelineCommentRef.current.innerText = text;
            });
            canvas.addEventListener("mouseleave", (e) => {
                timelineCommentRef.current.innerText = "";
            });
        } 
        //context.fillStyle = 'rgba(255, 255, 255, 0)';
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
                waveColor: 'green',
                progressColor: 'blue',
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
                    <div className="canvas-panel">                 
                        <div className="waveform" ref={waveformRef}></div>
                        <canvas className="canvas" ref={canvasRef} width="50rem" height="1rem">
                        </canvas>
                    </div>

                </div>
                <div>
                    <img className="audio-image" src="https://i.ytimg.com/vi/6lt2JfJdGSY/maxresdefault.jpg" alt=""/>
                </div>
            </div>
            <p className="timeline-comment" ref={timelineCommentRef}></p>
            <form>
                <input type="text" value={username} onChange={handleChangeUsername} placeholder="Username"/>
                <input type="text" value={comment} onChange={handleChangeComment} placeholder="Write a comment"/>
                <input type="submit" value="Post" onClick={handleSubmitComment}/>
            </form>
        </div>
    )
    
}