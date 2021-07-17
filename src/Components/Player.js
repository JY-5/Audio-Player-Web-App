import React, { useRef, useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import PlayButton from "./PlayButton";
import AddComment from "./AddComment";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

export const Player = (props) => {
    const { timelineComments } = props;
    const waveformRef = useRef();
    const waveformStatusRef = useRef();
    const avatarsCanvasRef = useRef();
    const timelineRef = useRef();
    const timelineCommentRef = useRef();
    const [duration, setDuration] = useState();
    const [wavesurferObject, setWavesurferObject] = useState();
    const windowOriginalWidth = window.innerWidth;

    useEffect(() => {
        const avatarsCanvas = avatarsCanvasRef.current;
        const width = fitToContainer(avatarsCanvas);
        const ctx = avatarsCanvas.getContext('2d');
        let timelineCommentsData = [];  
        
        const redraw = function() {
            const remToPixelConversion = Math.round(16 * window.innerWidth / windowOriginalWidth);
            const distanceToWindowLeft = 4 * remToPixelConversion;
            const halfAvatarWidth = Math.round(14 * window.innerWidth / windowOriginalWidth);

            ctx.clearRect(0, 0, avatarsCanvas.width, avatarsCanvas.height);
            timelineCommentsData = [];
            for (let comment of timelineComments) {
                const img = new Image();
                img.src = comment.avatar;
                img.alt = "";
                img.onload = function() {
                    const xCoordinate = comment.timestamp / duration * width;
                    ctx.drawImage(img, xCoordinate, 0);
                    const centerXCoordinate = xCoordinate + distanceToWindowLeft + halfAvatarWidth;
                    timelineCommentsData.push([centerXCoordinate, comment.username, comment.comment, comment.avatar, xCoordinate]);
                };
            }
        }

        redraw();
        window.addEventListener('resize', redraw);

        avatarsCanvas.addEventListener("mousemove", handleMouseMove);

        function handleMouseMove(e) {
            // Find center coordinate of the closest avatar to current mouse coordinate x
            const xCoordinate = e.clientX; // Mouse cursor coordinates x, y
            let closestX = -1; // the avatar index closest to mouse cursor
            let minDistance = Number.MAX_VALUE; // min distance from current mouse cursor to closest avatar center
            for (let i = 0; i < timelineCommentsData.length; i++) {
                const distance = Math.abs(xCoordinate - timelineCommentsData[i][0]);
                if (distance <= minDistance) {
                    closestX = i;
                    minDistance = distance;
                }
            }

            // Display comment when hovering within an avatar rectangle
            const halfAvatarWidth = Math.round(14 * window.innerWidth / windowOriginalWidth);
            if (closestX !== -1 && minDistance < halfAvatarWidth) {
                // Show partially overlaid image
                const img = new Image();
                img.src = timelineCommentsData[closestX][3];
                img.alt = "";
                ctx.drawImage(img, timelineCommentsData[closestX][4], 0);
                // Show comment
                timelineCommentRef.current.classList.remove("hidden");
                timelineCommentRef.current.innerText = timelineCommentsData[closestX][1] + ": " + timelineCommentsData[closestX][2];
                // Hover effect basically runs well. But there is still a minor problem sometimes when we zoom in/out. If you want to resize the window, you 
                // need to refresh the page to ensure hover effect is right
                /* Debug print:*/
                /*console.log("closestX: " + closestX +
                    ", centerXCoordinate: " + timelineCommentsData[closestX][0] +
                    ", xCoordinate: " + timelineCommentsData[closestX][4] +
                    ", windowCurrentWidth: " + window.innerWidth +
                    ", windowOriginalWidth: " + windowOriginalWidth); */
            } else {
                timelineCommentRef.current.innerText = "";
            }
        }

        return () => {
            window.removeEventListener('resize', redraw);
            avatarsCanvas.removeEventListener("mousemove", () => {});
        }
    });

    function fitToContainer(canvas){
        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='6%';
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
                plugins: [
                    TimelinePlugin.create({
                        container: timelineRef.current,
                    })
                  ]
            });

            setWavesurferObject(wavesurfer);
            wavesurfer.load('514386__kevin-manickam__relaxation-sound.wav');
            wavesurfer.on("ready", function() {
                waveformStatusRef.current.classList.add("remove");
                const durationData = parseInt(wavesurfer.getDuration());
                setDuration(durationData);
                wavesurfer.setVolume(0.5);                
            });

            return () => {
                if (wavesurfer.current) {
                    wavesurfer.current.destroy();
                    wavesurfer.current.destroyPlugin('timeline');
                } 
            }
        }
    }, []);

    return (
        <div className="">
            <div className="player-panel">
                <div className="info-waveform">
                    <div className="audio-info">
                        <div className="info">
                            <p className="artist">Kevin Manickam</p>
                            <p className="audio-name">Relaxation Music</p>
                        </div>
                        <PlayButton wavesurferObject={wavesurferObject}/>
                    </div>
                    <div className="canvas-panel">                 
                        <div className="waveform" ref={waveformRef}>
                            <span className="loading" ref={waveformStatusRef}>Loading...</span>
                        </div>
                        <div ref={timelineRef} className="timeline"></div>
                        <canvas className="avatars-canvas" ref={avatarsCanvasRef} >
                        </canvas>
                        <span className="timeline-comment hidden" ref={timelineCommentRef}></span>
                    </div>                
                </div>
                <div className="audio-image-panel">
                    <img className="audio-image" src="https://ae01.alicdn.com/kf/H7345eeeb4dcb480c9a3cf446529704f7l/DIY-5D-full-square-Diamond-embroidery-village-nature-landscape-3d-diamond-painting-Cross-Stitch-Rhinestone-mosaic.jpg" alt=""/>
                </div>
            </div>
            <AddComment fetchComments={props.fetchComments}wavesurferObject={wavesurferObject} duration={duration} />
        </div>
    )
}