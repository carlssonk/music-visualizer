import React, { Component } from 'react'
// Components
import SongInfo from "./components/song-info/SongInfo"
import Aside from "./components/aside/Aside"
import Player from "./components/player/Player"
import Spectrum from "./components/effects/Spectrum"
// Styling
import StyledSongify from "./styles/Songify.module.scss"
// Data
import data from "./MusicData"

class Songify extends Component {
  constructor(props) {
    super(props)

    this.data = data()

    this.audioRef = React.createRef();

    this.state = {
      playlist: this.data,
      hasBeenPlayed: [this.data[0].id],
      currentSong: this.data[0],
      metadata: {
        duration: 0,
        currentTime: 0,
        animationPercentage: 0,
      },
      isPlaying: false,
      isHolding: false,
      volume: 0.2,
      isShuffle: false,
      isRepeat: false
    }
    
  }

  componentDidMount() {
    this.audioRef.current.volume = this.state.volume / 5;
  }

  changeVolumeHandler = (volume) => {
    this.audioRef.current.volume = volume / 5 // Change the actual volume
    this.setState({ volume: volume }) // Set state 
    
  }

  playSongHandler = (action) => {
    if(action === "play-song-handler") {
      this.state.isPlaying ? this.audioRef.current.pause() : this.audioRef.current.play();
      this.setState({ isPlaying: !this.state.isPlaying })
    }
    if(action === "is-playing") {
      this.setState({ isPlaying: true })
    }

    if(action === "toggle-shuffle") {
      this.setState({ isShuffle: !this.state.isShuffle })
    }
    if(action === "toggle-repeat") {
      this.setState({ isRepeat: !this.state.isRepeat })
    }
  }

  skipSongHandler = async (action, id, force) => {
    const currentSongIndex = this.state.playlist.findIndex(song => song.id === this.state.currentSong.id)
    const currentSongIndexRelative = this.state.hasBeenPlayed.findIndex(songId => songId === this.state.currentSong.id) // relative to played songs
    const currentSongId = this.state.playlist[currentSongIndex].id

    // Change song by skip forward OR when song is done
    if(action === "skip-forward") {
      // If current song is last song && isRepeat is false && force is not true, return
      if(currentSongIndex === this.state.playlist.length - 1 && this.state.isRepeat === false && !force) return

      const nextSongIndex = (currentSongIndex + 1) % this.state.playlist.length;
      await this.setState({ currentSong: this.state.playlist[nextSongIndex] })

      this.updateHasBeenPlayed(this.state.playlist[nextSongIndex].id);
    }

    if(action === "shuffle") {
      const playlist = [...this.state.playlist]
      const hasBeenPlayed = [...this.state.hasBeenPlayed, currentSongId]

      // If we already have songs that we've played in shuffle mode, go to that song
      if(this.state.hasBeenPlayed.length > 0 && currentSongId !== this.state.hasBeenPlayed[this.state.hasBeenPlayed.length - 1]) {

        const playlist = [...this.state.playlist]

        const nextSongIndex = currentSongIndexRelative + 1
        const findSong = playlist.filter(e => e.id === this.state.hasBeenPlayed[nextSongIndex])
        await this.setState({ currentSong: findSong[0] })
        return
      }

      const newPlaylist = playlist.filter(e => {
        if(hasBeenPlayed.includes(e.id)) return false;
        return true
      })

      if(newPlaylist.length === 0) {
        if(this.state.isRepeat || force) {
          const randomIndex = Math.floor(Math.random() * playlist.length)
          await this.setState({ currentSong: playlist[Math.floor(Math.random() * playlist.length)] })
          this.setState({ hasBeenPlayed: [playlist[randomIndex].id] })
        } else {
          return
        }
      } else {
        const randomIndex = Math.floor(Math.random() * newPlaylist.length)
        await this.setState({ currentSong: newPlaylist[randomIndex] })
        this.updateHasBeenPlayed(newPlaylist[randomIndex].id);
      }
    }

    // Change song by skip back
    if(action === "skip-back") {
      const playlist = [...this.state.playlist]

      // If shuffle is not on, skip back 1 step
      if(!this.state.isShuffle) {
        const prevSongIndex = currentSongIndex === 0 ? null : currentSongIndex - 1
        if(prevSongIndex === null) return
        await this.setState({ currentSong: this.state.playlist[prevSongIndex] })
        return
      }

      const prevSongIndex = currentSongIndexRelative <= 0 ? null : currentSongIndexRelative - 1
      if(prevSongIndex === null) return
      const findSong = playlist.filter(e => e.id === this.state.hasBeenPlayed[prevSongIndex])
      await this.setState({ currentSong: findSong[0] })
    }

    // Change song by user click
    if(action === "change-song") {
      const newSongIndex = this.state.playlist.findIndex(song => song.id === id);
      await this.setState({ currentSong: this.state.playlist[newSongIndex] })
      this.setState({ hasBeenPlayed: [this.state.playlist[newSongIndex].id] })
    }

    // Set first song after we clear hasBeenPlayed list
    if(this.state.hasBeenPlayed.length === 0) this.setState({ hasBeenPlayed: [this.state.currentSong.id] })

  }

  updateHasBeenPlayed = (songId) => {
    this.setState({
      hasBeenPlayed: [
        ...this.state.hasBeenPlayed,
        songId
      ]
    })
  }


  // This function is updating all the time when song is on
  timeUpdateHandler = (e, current_, duration_) => {
    if(this.state.isHolding) return

    let current;
    let duration;

    if(e === null) {
      current = current_;
      duration = duration_;
    }
    if(e !== null) {
      current = e.target.currentTime;
      duration = e.target.duration;
    }

    this.updateTrackAnimation(current, duration)

  }
  
  
    // This function is updating when called
    updateTrackAnimation = (current, duration) => {
      // Calculate percentage
      const roundedCurrent = Math.round(current * 10) / 10;
      const roundedDuration = Math.round(duration * 10) / 10;
      const currentPercentage = (roundedCurrent / roundedDuration) * 100;
      const animation = Math.round(currentPercentage * 10) / 10;
  
      this.setState({
        metadata: {
          duration: duration,
          currentTime: current,
          animationPercentage: animation
        }
      });
    };
  
    // If this is true, timeUpdateHandler() will stop so it doesn't fire all the time
    handleIsHolding = (holding) => {
      holding ? this.setState({isHolding: true}) : this.setState({isHolding: false});
    };






  render() {
    return (
      <div className={StyledSongify.container}>
        <Aside playlist={this.state.playlist} currentSong={this.state.currentSong} metadata={this.state.metadata} skipSongHandler={this.skipSongHandler}/>
        <SongInfo currentSong={this.state.currentSong} />
        <Spectrum currentSong={this.state.currentSong} audioRef={this.audioRef} isPlaying={this.state.isPlaying} />
        <Player
        currentSong={this.state.currentSong}
        currentVolume={this.state.volume}
        changeVolumeHandler={this.changeVolumeHandler}
        playSongHandler={this.playSongHandler}
        isPlaying={this.state.isPlaying}
        skipSongHandler={this.skipSongHandler} 
        audioRef={this.audioRef} 
        metadata={this.state.metadata}
        handleIsHolding={this.handleIsHolding}
        updateTrackAnimation={this.updateTrackAnimation}
        timeUpdateHandler={this.timeUpdateHandler}
        />

        {/* <Waves isPlaying={this.state.isPlaying} /> */}


        <audio
          onTimeUpdate={this.timeUpdateHandler}
          onLoadedMetadata={this.timeUpdateHandler}
          onEnded={this.state.isShuffle ? () => this.skipSongHandler("shuffle") : () => this.skipSongHandler("skip-forward")}
          src={this.state.currentSong.audio}
          ref={this.audioRef}
        ></audio>
      </div>
    )
  }
}

export default Songify