import React, { Component } from 'react'
// import Wave from "@foobar404/wave"

class Spectrum extends Component {
  constructor(props) {
    super(props)

    this.canvasRef = React.createRef(null)

    this.state = {
      buildAnalyser: false,
      toggleHeight: false,
    }

  }



  componentDidUpdate() {
    // Make sure we have a user interaction before building the analyser
    if(this.props.isPlaying) {
      this.initAnalyser();
    }
  }



  initAnalyser = () => {
    if(this.state.buildAnalyser === true) return
    this.setState({buildAnalyser: true})

    // ###################################
    // ########## VISUALIZER SETUP #######
    // ###################################

    // Elements
    const audio = this.props.audioRef.current;
    const canvas = this.canvasRef.current

    // Context
    const ctx = canvas.getContext("2d");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // SOURCE AND ANALYSER WIRING
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // ANALYSER SETTINGS
    analyser.fftSize = 512;
    analyser.maxDecibels = 50;
    analyser.minDecibels = -120;
    analyser.smoothingTimeConstant = 0.85

    // Data Array
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);



    // ###################################
    // ############## DOTS ###############
    // ###################################

    const dots=[];
    let npt=0;

    const config = {
       circleRadius: 150,
       multiplier:   40,
       colorSpeed:   20,
       hueStart:     220,
       glow:         0
    }

    function emitDot() {
      if (dots.length > 150) { return; }
      dots.push({
      xp:  canvas.width/2,
      yp:  centerY,
      xv:  Math.random()*0.4-0.2,
      yv:  Math.random()*0.4-0.2,
      rad: Math.random()*(15-2)+2,
      hue: Math.random()*50-25
      });
    }


    function drawDots(){
      var avg = averageFrequency();
      
      for(let i = 0; i < dots.length; i++){
         ctx.beginPath();
         var grd = ctx.createRadialGradient(dots[i].xp + dots[i].rad, dots[i].yp + dots[i].rad, 0, dots[i].xp + dots[i].rad, dots[i].yp + dots[i].rad, dots[i].rad);
         grd.addColorStop(0, "hsla("+(config.hueStart + npt * config.colorSpeed + dots[i].hue)+", 50%, 50%, "+(avg / 400)+"%)");
         grd.addColorStop(1, "hsla("+(config.hueStart + npt * config.colorSpeed + dots[i].hue)+", 50%, 50%, 0%)");
         ctx.fillStyle = grd;
         ctx.fillRect(dots[i].xp, dots[i].yp, dots[i].rad*2, dots[i].rad*2);
         ctx.closePath();
         
         if(dots[i].xp > canvas.width || dots[i].xp < 0 || dots[i].yp > canvas.width || dots[i].yp < 0){
            dots[i] = dots[dots.length-1];
            dots.pop();
         } else {
            dots[i].xp += dots[i].xv * Math.pow(avg/1000, 1.5);
            dots[i].yp += dots[i].yv * Math.pow(avg/1000, 1.5);
         }
      }  
   }


    // ############################
    // ########## CANVAS ##########
    // ############################

    // Canvas Size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Center Circle
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 140; // define circle radius

    let mobileTopWhiteSpace = 28;
    let initialWindowHeight = window.innerHeight;



    // Make spectrum responsive
    window.onresize = function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      centerX = canvas.width / 2;

      mediaQuerySpectrumCenter()
      
      // If we are on mobile browser, we will have a top whitespace pf 28 or 56/2px
      if(window.orientation !== undefined) {
        if(window.innerHeight === initialWindowHeight) {
          centerY = (canvas.height / 2 - 20)
        } else {
          centerY = (canvas.height / 2 - 20) - mobileTopWhiteSpace;
        }
      }

    };


    mediaQuerySpectrumCenter()
    function mediaQuerySpectrumCenter() {
      if(window.innerWidth <= 850) {
        centerY = canvas.height / 2 - 20;
      }  else if(window.innerHeight <= 800) { 
        centerY = canvas.height / 2 - 50;
      } else {
        centerY = canvas.height / 2 - 100;
      }
    }



    // #####################################
    // ####### SPECTRUM CONFIGURATION ######
    // #####################################

    // Variables
    let barWidth = 800 / bufferLength;
    let barHeight
    let circleJumper = 500; // Lower value will make spectrum radius jump/scale more
    let circleRotation = 1.57 * 3;

    // Start dots
    setInterval(emitDot, 50)


    // ####################################
    // ########## ANIMATION LOOPER ########
    // ####################################

    function animationLooper() {
      // Background
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // Analyser data
      analyser.getByteFrequencyData(dataArray);

      // Draw Dots
      drawDots();

      // Cakclate average low-average-frequency
      let lowAvgFreq = lowAverageFrequency();
      
      // //  Circle
      ctx.beginPath();
      ctx.arc(centerX,centerY,(radius + lowAvgFreq/circleJumper),0,2*Math.PI);
      ctx.stroke();
      ctx.globalCompositeOperation='destination-over';

      // Lines
      ctx.lineWidth = barWidth;


      // ##########################################
      // ######### CIRCLE MEDIA QUERIES ###########
      // ##########################################


      // circle radius
      radius = 140;
      // image radius
      document.documentElement.style.setProperty(
        '--image-width', ((radius+140) + lowAvgFreq/(circleJumper/2)) + "px"
      )

      if(window.innerWidth <= 850) {
        // Change Image radius
        document.documentElement.style.setProperty(
          '--image-width', ((radius+65) + lowAvgFreq/(circleJumper/2)) + "px"
        )
        // Change Spectrum Radius
        radius = 100;
      }

      if(window.innerWidth <= 500) {
        // Change Image radius
        document.documentElement.style.setProperty(
          '--image-width', ((radius+60) + lowAvgFreq/(circleJumper/2)) + "px"
        )
        // Change Spectrum Radius
        radius = 80;
      }


      for(var i = 0; i < bufferLength - 85; i++){ // - 85 because the low frequencies does not pick up for most songs


          barHeight = dataArray[i];

          //divide a circle into equal parts
          const rads = Math.PI * 2.995 / bufferLength;
    
          // set coordinates
          const x = centerX + Math.cos(rads * i+circleRotation) * (radius + lowAvgFreq/circleJumper);
          const y = centerY + Math.sin(rads * i+circleRotation) * (radius + lowAvgFreq/circleJumper);
          const x_end = centerX + Math.cos(rads * i+circleRotation)*((radius + lowAvgFreq/circleJumper) + (barHeight));
          const y_end = centerY + Math.sin(rads * i+circleRotation)*((radius + lowAvgFreq/circleJumper) + (barHeight));
          
          //draw a bar
          drawBar(x, y, x_end, y_end, dataArray[i], i, ctx);
      
      }

      window.requestAnimationFrame(animationLooper);

    }

    // for drawing a bar
    const drawBar = (x1, y1, x2, y2, frequency, i, ctx) => {
      if(this.props.currentSong === undefined) return;
      // Line color
      // var lineColor = "rgb(" + currentSong.color[0] + ", " + 255 + ", " + 255 + ")";
      if(typeof this.props.currentSong.color === "number") {
        const hue = i/5 + this.props.currentSong.color;
        ctx.strokeStyle = `hsl(${hue}, 100%, 40%)`;
      } else {
        ctx.strokeStyle = this.props.currentSong.color;
      }


      // Line Movement
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
    }

    // All frequencies
    function averageFrequency() {
      var avg = 0;
      for (var i = 0; i < dataArray.length; i++) {
      avg += dataArray[i];
      }
      return avg;
    }
    // For the deep tones/frequencies
    function lowAverageFrequency() {
      var avg = 0;
      for (var i = 0; i < dataArray.length - 100; i++) {
      avg += dataArray[i];
      }
      return avg;
    }

    // Start looper
    animationLooper();
  }




  





  render() {
    return (
      <>
      <canvas className="canvas" ref={this.canvasRef}></canvas>
      </>
    )
  }

}

export default Spectrum
