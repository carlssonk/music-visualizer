import React, { useState } from 'react'
// Styling
import StyledPlayer from "../../styles/Player.module.scss"

function PlayerTrack({ currentVolume, metadata, audioRef, timeUpdateHandler, handleIsHolding, updateTrackAnimation }) {
  const [inputValue, setInputValue] = useState(0);

  const formatTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  // When user skips forward or backwards when song is playing, volume will fade
  const smoothAudio = () => {
    audioRef.current.volume = 0;
    let audio = 0;

    const audioFade = setInterval(() => {
      audio += 1;

      if(audio >= (currentVolume*100) / 5) {
        audioRef.current.volume = currentVolume / 5;
        clearInterval(audioFade)
        return
      } 

      audioRef.current.volume = (audio / 100);
    }, 20)
  }


  // Call this on mouse hold & drag
  const dragHandler = (e) => {
    handleIsHolding(true); // Mouse pressed down
    setInputValue(e.target.value); // So we know what position we are on when mouse is released
    updateTrackAnimation(e.target.value, audioRef.current.duration);
  }

  // Call this on mouse release
  const setPlayback = () => {
    smoothAudio();
    handleIsHolding(false);
    timeUpdateHandler(null, inputValue, audioRef.current.duration);
    audioRef.current.currentTime = inputValue;
  }
  

  return (
    <div className={StyledPlayer.trackContainer}>
      <div className={StyledPlayer.time}>{formatTime(metadata.currentTime || 0)}</div>

      <div className={StyledPlayer.trackWrapper}>
          <input
            min={0}
            max={metadata.duration || 0}
            value={metadata.currentTime}
            onChange={dragHandler}
            onMouseUp={setPlayback}
            // onMouseUp for mobile
            onTouchEnd={setPlayback}
            type="range"
          />

          <div className={StyledPlayer.trackBox}>

            <div className={StyledPlayer.innerTrackBox}>
              <div style={{transform: `translate3d(-${100 - metadata.animationPercentage}%, 0, 0)`}} className={StyledPlayer.animateTrackFill}></div>
              <div style={{transform: `translate3d(-${100 - metadata.animationPercentage}%, -50%, 0)`}} className={StyledPlayer.animateTrack}>
                <div className={StyledPlayer.circle}></div>
              </div>

              <div className={StyledPlayer.fillTrack}></div>
            </div>

          </div>

        </div>

      <div className={StyledPlayer.time}>{formatTime(metadata.duration || 0)}</div>
    </div>
  )
}

export default PlayerTrack
