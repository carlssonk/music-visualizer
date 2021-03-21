import React, { useRef, useState, useEffect } from 'react'
// Styling
import StyledPlayer from "../../styles/Player.module.scss"
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faStepForward,
  faStepBackward,
  faRandom,
  faRedoAlt
} from "@fortawesome/free-solid-svg-icons";



function PlayerBtns({currentSong, playSongHandler, isPlaying, skipSongHandler, audioRef}) {

  const firstRender = useRef(true);

  const [toggleShuffle, setToggleShuffle] = useState(false);
  const [toggleRepeat, setToggleRepeat] = useState(false);
  const [shuffleHover, setShuffleHover] = useState(false);
  const [repeatHover, setRepeatHover] = useState(false);

  // Play song when song changes
  useEffect(() => {
    if(!firstRender.current) {

      const playPromise = audioRef.current.play();
      playPromise &&
        playPromise.then(() => {}).catch(() => {})

        playSongHandler("is-playing")
    }
    firstRender.current = false;
  }, [currentSong, audioRef, playSongHandler])


  const iconStyleColor = {
    color: "#0ebb4b",
  }

  const iconStyleColorHover = {
    color: "#13f361",
  }

  const handleToggleShuffle = () => {
    setToggleShuffle(!toggleShuffle)
    playSongHandler("toggle-shuffle")
  }

  const handleToggleRepeat = () => {
    setToggleRepeat(!toggleRepeat)
    playSongHandler("toggle-repeat")
  }



  return (
    <>
      <div className={StyledPlayer.btnsBox}>
          <div 
          onClick={handleToggleShuffle}
          className={StyledPlayer.iconBox}
          onMouseEnter={() => setShuffleHover(true)}
          onMouseLeave={() => setShuffleHover(false)}
          >
            <FontAwesomeIcon
              style={toggleShuffle ? shuffleHover ? iconStyleColorHover : iconStyleColor : null}
              size="1x"
              icon={faRandom}
            /> 
          </div>

          <div
          onClick={() => skipSongHandler("skip-back")}
          className={StyledPlayer.iconBox}
          >
            <FontAwesomeIcon
              className={StyledPlayer.skipIcon}
              size="1x"
              icon={faStepBackward}
            /> 
          </div>

          <FontAwesomeIcon
            onClick={() => playSongHandler("play-song-handler")}
            className={StyledPlayer.playIcon}
            size="2x"
            icon={isPlaying ? faPauseCircle : faPlayCircle}
          />

          <div
          onClick={toggleShuffle ? () => skipSongHandler("shuffle", null, true) : () => skipSongHandler("skip-forward", null, true)}
          className={StyledPlayer.iconBox}
          >
            <FontAwesomeIcon
              className={StyledPlayer.skipIcon}
              size="1x"
              icon={faStepForward}
            />
          </div>

          <div
            onClick={handleToggleRepeat}
            className={StyledPlayer.iconBox}
            onMouseEnter={() => setRepeatHover(true)}
            onMouseLeave={() => setRepeatHover(false)}
          >
            <FontAwesomeIcon
              style={toggleRepeat ? repeatHover ? iconStyleColorHover : iconStyleColor : null}
              size="1x"
              icon={faRedoAlt}
            /> 
          </div>

      </div>
    </>
  )
}

export default PlayerBtns
