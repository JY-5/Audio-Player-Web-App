import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import PlayButton from "./PlayButton";
import Waveform from "./Waveform";
import AddComment from "./AddComment";

export const Player = (props) => {
    const [duration, setDuration] = useState();
    const [wavesurferObject, setWavesurferObject] = useState();

    function getAudioDuration(audioDuration) {
        setDuration(audioDuration);
    }

    function getWavesurferObject(wavesurfer) {
        setWavesurferObject(wavesurfer);
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
                        <PlayButton wavesurferObject={wavesurferObject}/>
                    </div>
                    <Waveform timelineComments={props.timelineComments} getAudioDuration={getAudioDuration} getWavesurferObject={getWavesurferObject}/>
                </div>
                <div className="audio-image-panel">
                    <img className="audio-image" src="https://ae01.alicdn.com/kf/H7345eeeb4dcb480c9a3cf446529704f7l/DIY-5D-full-square-Diamond-embroidery-village-nature-landscape-3d-diamond-painting-Cross-Stitch-Rhinestone-mosaic.jpg" alt=""/>
                </div>
            </div>
            <AddComment fetchComments={props.fetchComments}wavesurferObject={wavesurferObject} duration={duration} />
        </div>
    )
}