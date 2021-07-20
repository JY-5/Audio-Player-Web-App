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

    useEffect(() => {
        const avatarsCanvas = avatarsCanvasRef.current;
        // Get width of avatars canvas 
        let width = fitToContainer(avatarsCanvas);
        const ctx = avatarsCanvas.getContext('2d');
        let timelineCommentsData = [];  
        // 1rem = 16px
        const remToPixelConversion = 16;
        // This avatars canvas is 2rem away from the left side of the window
        const distanceToWindowLeft = 2 * remToPixelConversion;
        // An avatar is 28px long 
        const halfAvatarWidth = 14;

        const redraw = function() {
            ctx.clearRect(0, 0, avatarsCanvas.width, avatarsCanvas.height);
            // Get current width of avatars canvas 
            width = fitToContainer(avatarsCanvas);

            timelineCommentsData = [];
            for (let comment of timelineComments) {
                const img = new Image();
                img.src = comment.avatar;
                img.alt = "";
                // eslint-disable-next-line no-loop-func
                img.onload = function() {
                    // Width of this canvas is 110% of its parent now, 
                    // we need to convert it to map with the waveform precisely
                    let xCoordinate = comment.timestamp / duration * width * 100 / 110;
                    ctx.drawImage(img, xCoordinate, 0);
                    const centerXCoordinate = (xCoordinate + distanceToWindowLeft + halfAvatarWidth);
                    timelineCommentsData.push([centerXCoordinate, comment.username, comment.comment, comment.avatar, xCoordinate]);
                };
            }
        }
        
        redraw();

        window.addEventListener('resize', redraw);

        avatarsCanvas.addEventListener("mousemove", handleMouseMove);

        function handleMouseMove(e) {
            // Find center coordinate of the closest avatar to current mouse coordinate x
            const xCoordinate = e.clientX; // Current mouse cursor coordinates x, y

            let closestX = -1; // The avatar index closest to mouse cursor
            let minXDistance = Number.MAX_VALUE; // Min x distance from current mouse cursor to closest avatar center
            for (let i = 0; i < timelineCommentsData.length; i++) {
                const xDistance = Math.abs(xCoordinate - timelineCommentsData[i][0]);

                if (xDistance <= minXDistance) {
                    closestX = i;
                    minXDistance = xDistance;
                }
            }

            // Display comment when hovering within an avatar rectangle
            const halfAvatarWidth = 14;
            if (closestX !== -1 && minXDistance <= halfAvatarWidth) {
                // Show partially overlaid image
                const img = new Image();
                img.src = timelineCommentsData[closestX][3];
                img.alt = "";
                ctx.drawImage(img, timelineCommentsData[closestX][4], 0);

                // Show comment
                timelineCommentRef.current.classList.remove("hidden");
                timelineCommentRef.current.innerText = timelineCommentsData[closestX][1] + ": " + timelineCommentsData[closestX][2];
            } else {
                timelineCommentRef.current.innerText = "";
            }
        }

        return () => {
            window.removeEventListener('resize', redraw);
            avatarsCanvas.removeEventListener("mousemove", handleMouseMove);
        }
    }, [duration, timelineComments]);

    function fitToContainer(canvas){
        // Make it visually fill the positioned parent
        // Make width as 110% of parent to ensure that avatar at the end can show
        canvas.style.width ='110%';
        canvas.style.height='7%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        return canvas.width;
    }

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
                        <canvas className="avatars-canvas" ref={avatarsCanvasRef} ></canvas>
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