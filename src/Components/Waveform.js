import React, { useRef, useEffect, useState } from 'react'; 
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

export const Waveform = (props) => {
    const { getWavesurferObject, getAudioDuration, timelineComments } = props;
    const waveformRef = useRef();
    const waveformStatusRef = useRef();
    const canvasRef = useRef();
    const timelineRef = useRef();
    const timelineCommentRef = useRef();
    const [duration, setDuration] = useState();

    useEffect(() => {
        const canvas = canvasRef.current;
        const width = fitToContainer(canvas);
        const ctx = canvas.getContext('2d');
        const rem4xPixels = 64;
        const halfThumbnailWidth = 15;
        const timelineCommentsData = [];  

        if (timelineComments) {
            for (let comment of timelineComments) {
                const img = new Image();
                img.src = comment.avatar;
                img.alt = "";
                img.onload = function() {
                    const x = comment.timestamp / duration * width;
                    ctx.drawImage(img, x, 0);
                    timelineCommentsData.push([x + rem4xPixels + halfThumbnailWidth, comment.username, comment.comment, comment.avatar, x]);
                };
            }
        }

        canvas.addEventListener("mousemove", (e) => {
            // Find center coordinate of the closest avatar to current mouse coordinate x
            const x = e.clientX; // Mouse cursor coordinates x, y
            let closestX = -1; // the avatar index closest to mouse cursor
            let minDist = 100000; // min distance from current mouse cursor to closest avatar center
            for (let i = 0; i < timelineCommentsData.length; i++) {
                const dist = Math.abs(timelineCommentsData[i][0] - x);
                if (dist < minDist) {
                    closestX = i;
                    minDist = dist;
                }
            }

            // Display comment if within avatar rectangle
            const halfThumbnailWidth = 15;
            if (closestX !== -1 && minDist < halfThumbnailWidth) {
                const img = new Image();
                img.src = timelineCommentsData[closestX][3];
                img.alt = "";
                ctx.drawImage(img, timelineCommentsData[closestX][4], 0);
                timelineCommentRef.current.classList.remove("hidden");
                timelineCommentRef.current.innerText = timelineCommentsData[closestX][1] + ": " + timelineCommentsData[closestX][2];
            } else {
                timelineCommentRef.current.innerText = "";
            }
        });
    });

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
                plugins: [
                    TimelinePlugin.create({
                        container: timelineRef.current,
                    })
                  ]
            });

            getWavesurferObject(wavesurfer);
            wavesurfer.load('514386__kevin-manickam__relaxation-sound.wav');
            wavesurfer.on("ready", function() {
                waveformStatusRef.current.classList.add("remove");
                const durationData = parseInt(wavesurfer.getDuration());
                getAudioDuration(durationData);
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
        <div className="canvas-panel">                 
            <div className="waveform" ref={waveformRef}>
                <span className="loading" ref={waveformStatusRef}>Loading...</span>
            </div>
            <div ref={timelineRef} className="timeline"></div>
            <canvas className="canvas" ref={canvasRef} width="52rem" height="1rem">
            </canvas>
            <span className="timeline-comment hidden" ref={timelineCommentRef}></span>
        </div>
    )
}

export default Waveform