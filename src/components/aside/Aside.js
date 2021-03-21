import React, { useState, useEffect, useRef } from 'react'
// Components
import Song from "./Song"
// Styling
import StyledAside from "../../styles/Aside.module.scss"
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";


function Aside({ playlist, currentSong, skipSongHandler }) {

  const aside = useRef(null);
  const asideContainer = useRef(null);

  const [toggleAside, setToggleAside] = useState(false);
  const [asideWidth, setAsideWidth] = useState(400);
  const [maxAsideWidth, setMaxAsideWidth] = useState(window.innerWidth / 1.5);
  const [isHolding, setIsHolding] = useState(false);



  const handleToggleAside = () => {
    setToggleAside(!toggleAside)
  }

  // Toggle off isHolding
  useEffect(() => {
    document.addEventListener("mouseup", function() {
      setIsHolding(false);
      document.documentElement.style.setProperty('--cursor', "auto") // reset cursor to auto
    })
  },[])

  // Toggl on isHolding
  const handleAsideDrag = () => {
    setIsHolding(true);
  }

  // Listen for mouse move
  useEffect(() => {
    if(isHolding) {
      document.onmousemove = function(e) {
        setAsideWidth(e.clientX)
        document.documentElement.style.setProperty('--cursor', "col-resize") // make sure cursor is 'col-resize' even if mouse leaves border
      }
    } else {
      document.onmousemove = null;
    }
  },[isHolding])



  // Apply this style when toggled on
  const asideStyleOn = {
    transform: "translate3d(0, 0, 0)",
    width: asideWidth,
    maxWidth: window.innerWidth / 1.5
  }
  // Apply this style when toggled off
  const asideStyleOff = {
    transform: "translate3d(calc(-100% + 2px), 0, 0)",
    width: asideWidth,
    maxWidth: maxAsideWidth
  }

  window.addEventListener('resize', reportWindowSize);

  function reportWindowSize() {
    setMaxAsideWidth(window.innerWidth / 1.5)
  }


  return (
    <div 
    ref={asideContainer} 
    className={StyledAside.container}
    >
      <aside 
      ref={aside} 
      className={StyledAside.aside}
      style={toggleAside ? asideStyleOn : asideStyleOff}
      >
        <div className={StyledAside.asideBtn} onClick={handleToggleAside}>
          <FontAwesomeIcon
              style={toggleAside ? {transform: "rotateZ(180deg)"} : {transform: "rotateZ(0deg)"}  }
              size="1x"
              icon={faChevronRight}
            />
        </div>
        <div className={StyledAside.dragger} onMouseDown={handleAsideDrag}></div>
        <div className={StyledAside.top}>
          <div>TITLE</div>
          <div>ARTIST</div>
          <FontAwesomeIcon
              size="1x"
              icon={faClock}
            /> 
        </div>
        <ul>
          {
            playlist.map(song => {
              return <Song 
              key={song.id} 
              skipSongHandler={skipSongHandler}
              id={song.id}
              name={song.name} 
              artist={song.artist} 
              isCurrentSong={currentSong.id === song.id} 
              audioFile={song.audio} 
              asideWidth={asideWidth}
              />
              
            })
          }
        </ul>
      </aside>
      <div className={StyledAside.clickCatcher} onClick={() => setToggleAside(false)}></div>
    </div>
  )
}

export default Aside
