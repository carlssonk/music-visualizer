import React, { useEffect, useRef, useState } from 'react'
// Styling
import StyledAside from "../../styles/Aside.module.scss"

function Song({ name, artist, isCurrentSong, audioFile, skipSongHandler, id, asideWidth }) {

  const songBox = useRef();

  const divRef = useRef([]);
  const spanRef = useRef([]);

  const [duration, setDuration] = useState();

  useEffect(() => {
    returnAudioDuraiton()
    // eslint-disable-next-line
  }, [])


  useEffect(() => {
    songBox.current.classList.remove(`${StyledAside.active}`)
    if(isCurrentSong) songBox.current.classList.add(`${StyledAside.active}`)
  }, [isCurrentSong])

  const returnAudioDuraiton = () => {
    const audio = new Audio(audioFile);
    audio.onloadedmetadata = function() {
      formatTime(audio.duration)
    };
  }

  const formatTime = (time) => {
    setDuration(Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2))
  };


  useEffect(() => {
    for(let i = 0; i < divRef.current.length; i++) {
      spanRef.current[i].style.maxWidth = `${divRef.current[i].offsetWidth - 10}px`
    }
  }, [asideWidth])

  return (
    <div ref={songBox} className={StyledAside.songBox} onClick={() => skipSongHandler("change-song", id)}>
      <div ref={e => divRef.current[0] = e}><span ref={e => spanRef.current[0] = e}>{name}</span></div>
      <div ref={e => divRef.current[1] = e}><span ref={e => spanRef.current[1] = e}>{artist}</span></div>
      <div ref={e => divRef.current[2] = e}><span ref={e => spanRef.current[2] = e}>{duration}</span></div>
    </div>
  )
}

export default Song
