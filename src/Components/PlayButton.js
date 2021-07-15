import React, { useState } from 'react';

export const PlayButton = (props) => {
    const [playing, setPlaying] = useState(false);

    function handlePlay() {
        if (playing) {
            props.wavesurferObject.pause();
        } else {
            props.wavesurferObject.play();
        }
        setPlaying(!playing);
    }

    return (
        !playing ?
        <i className="fa fa-play-circle-o" onClick={handlePlay}></i>
            :
        <i className="fa fa-pause-circle-o" onClick={handlePlay}></i>
    )
}

export default PlayButton