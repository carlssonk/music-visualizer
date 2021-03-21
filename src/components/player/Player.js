import React, { Component } from 'react'
// Components
import PlayerBtns from './PlayerBtns'
import PlayerTrack from './PlayerTrack'
// Styling
import StyledPlayer from "../../styles/Player.module.scss"
// icons
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeDown,
  faVolumeUp,
  faVolumeMute
} from "@fortawesome/free-solid-svg-icons";



class Player extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lastVolume: 0.1
    }

  }



  handleMuteVolume = () => {
    this.setState({ lastVolume: this.props.currentVolume })
    this.props.changeVolumeHandler(0)
  }


  render() {
    return (
      <>
        <div className={StyledPlayer.container}>
          <PlayerBtns 
            currentSong={this.props.currentSong}
            playSongHandler={this.props.playSongHandler}
            isPlaying={this.props.isPlaying}
            skipSongHandler={this.props.skipSongHandler} 
            audioRef={this.props.audioRef} 
          />
          <PlayerTrack 
            currentVolume={this.props.currentVolume}
            metadata={this.props.metadata} 
            audioRef={this.props.audioRef}
            timeUpdateHandler={this.props.timeUpdateHandler} 
            handleIsHolding={this.props.handleIsHolding} 
            updateTrackAnimation={this.props.updateTrackAnimation} 
          />
          <div className={StyledPlayer.volumeContainer}>
            <div 
            className={StyledPlayer.volumeIconBox}
            onClick={this.props.currentVolume > 0 ? () => this.handleMuteVolume() : () => this.props.changeVolumeHandler(this.state.lastVolume) }
            >
              <FontAwesomeIcon
                size="2x"
                icon={this.props.currentVolume === 0 ? faVolumeMute : this.props.currentVolume < 0.5 ? faVolumeDown : faVolumeUp}
              /> 
            </div>
            <div className={StyledPlayer.volumeWrapper}>
              <input 
              type="range" 
              min="0" 
              max="100"
              defaultValue="10" 
              onChange={(e) => this.props.changeVolumeHandler(e.target.value / 100)}
              />

              <div className={StyledPlayer.volumeBox}>

                <div className={StyledPlayer.innerVolumeBox}>
                  <div style={{transform: `translate3d(-${100 - (this.props.currentVolume * 100)}%, 0, 0)`}} className={StyledPlayer.animateVolumeFill}></div>
                  <div style={{transform: `translate3d(-${100 - (this.props.currentVolume * 100)}%, -50%, 0)`}} className={StyledPlayer.animateVolume}>
                    <div className={StyledPlayer.volumeCircle}></div>
                  </div>

                  <div className={StyledPlayer.fillVolume}></div>
                </div>

              </div>  

            </div>
          </div>



          
        </div>
        {/* <audio
          onTimeUpdate={this.timeUpdateHandler}
          onLoadedMetadata={this.timeUpdateHandler}
          onEnded={() => this.props.skipSongHandler("skip-forward")}
          src={this.props.currentSong.audio}
          ref={this.audioRef}
        ></audio> */}
      </>
    )
  }
}

export default Player
