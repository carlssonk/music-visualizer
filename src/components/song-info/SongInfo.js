import React, { useRef, useState, useEffect } from 'react'
// Styles
import StyledSongInfo from "../../styles/SongInfo.module.scss"
// 
// import Spectrum from "../effects/Spectrum"

import NCS from "../../assets/ncs.png"

function SongInfo({currentSong}) {

  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const [spanWidth, setSpanWidth] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false)

  const [timeoutIdOne, setTimeoutIdOne] = useState();
  const [timeoutIdTwo, setTimeoutIdTwo] = useState();

  useEffect(() => {
    setIsAnimating(false) // clear isAnimating
    clearTimeout(timeoutIdOne) // clear interval when song changes
    clearTimeout(timeoutIdTwo) // clear interval when song changes

    setSpanWidth(firstNameRef.current.offsetWidth) // Set span width

    if(firstNameRef.current.offsetWidth > 200) nameSlider(firstNameRef.current.offsetWidth) // If span width is higher than 200, invoke animation
  // eslint-disable-next-line
  }, [currentSong]) 
  
  const nameSlider = (spanWidth) => {
    document.documentElement.style.setProperty(
      '--spanSlideWidth', `-${spanWidth+10}px` // + 10 to add spacing
    )
 
    const id_one = setTimeout(animateTrue, 1000)
    setTimeoutIdOne(id_one)

    const id_two = setTimeout(animateFalse, 11000)
    setTimeoutIdTwo(id_two)
  }

  const handleMouseHover = () => {
    if(spanWidth > 200 && !isAnimating) {
      setIsAnimating(true) // Start animation

      // Stop animation after 10s
      const id_two = setTimeout(animateFalse, 10000)
      setTimeoutIdTwo(id_two)
    }
  }

  const animateTrue = () => {
    setIsAnimating(true)
  }
  const animateFalse = () => {
    setIsAnimating(false)
  }

  return (
    <>
    <div className={StyledSongInfo.container}>
      <div className={StyledSongInfo.imageBox}>
        <img className={StyledSongInfo.image} src={NCS} alt="album_cover"/>
      </div>
    </div>
    <div className={StyledSongInfo.nameBox}>
        <div className={StyledSongInfo.currentlyPlaying}>Currently Playing</div>
        <div className={StyledSongInfo.underline}></div>
        <h1 
        onMouseOver={handleMouseHover}
        // on touch for mobile
        onTouchStart={handleMouseHover}
        className={StyledSongInfo.songName
        }>
          <span 
          ref={firstNameRef} 
          className={`${StyledSongInfo.firstSpan} ${isAnimating ? StyledSongInfo.firstSpanAnim : "" }`}>
            {currentSong.name}
          </span>
          <span 
          ref={lastNameRef} 
          className={`${StyledSongInfo.lastSpan} ${isAnimating ? StyledSongInfo.lastSpanAnim : "" }`}>
            {spanWidth > 200 ? currentSong.name : ""}
          </span>
        </h1>
        <h2 className={StyledSongInfo.songArtist}>{currentSong.artist}</h2>
        {/* <div className={StyledSongInfo.underline}></div> */}
    </div>
    </>
  )
}

export default SongInfo
