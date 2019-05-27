import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      workLength: 25, 
      breakLength: 5, 
      remainingTime: 1500, 
      title: 'Session Timer', 
      interval: null, 
      showInstructions: false, 
    }
    this.workLengthIncreaseHandler = this.workLengthIncreaseHandler.bind(this); 
    this.workLengthDecreaseHandler = this.workLengthDecreaseHandler.bind(this); 
    this.breakLengthIncreaseHandler = this.breakLengthIncreaseHandler.bind(this);
    this.breakLengthDecreaseHandler = this.breakLengthDecreaseHandler.bind(this); 
    this.playOrPauseHandler = this.playOrPauseHandler.bind(this); 
    this.resetHandler = this.resetHandler.bind(this); 
    this.showInstructionsHandler = this.showInstructionsHandler.bind(this); 
    this.playSound = this.playSound.bind(this); 
  }

  workLengthIncreaseHandler() {
    if(this.state.interval === null && this.state.workLength < 60) {
      this.setState({
        workLength: this.state.workLength + 1,
        remainingTime: (this.state.workLength + 1)* 60, 
      })
    }
  }

  workLengthDecreaseHandler() {
    if(this.state.interval === null && this.state.workLength > 1) {
      this.setState({
        workLength: this.state.workLength - 1, 
        remainingTime: (this.state.workLength - 1) * 60, 
      })
    }
  }

  breakLengthIncreaseHandler() {
    if(this.state.interval === null && this.state.breakLength < 30) {
      this.setState({
        breakLength: this.state.breakLength + 1, 
        remainingTime: this.state.workLength * 60, 
      })
    }
  }

  breakLengthDecreaseHandler() {
    if(this.state.interval === null && this.state.breakLength > 1) {
      this.setState({
        breakLength: this.state.breakLength - 1, 
        remainingTime: this.state.workLength * 60, 
      })
    }
  }
  
  isPlaying(state) {
    return state.interval === null ? false : true; 
  }

  stopIt() {
    clearInterval(this.state.interval); 
  }

  playSound() {
    const sound = document.getElementById('beep'); 
    sound.currentTime = 0; 
    sound.play();
  } 

  playOrPauseHandler() {
    if(this.isPlaying(this.state) === true) {
      this.stopIt();
      this.setState({
        interval: null
      })
    } else {
      this.setState({
        interval: setInterval(() => {
          if(this.state.remainingTime === 0) {
            this.playSound(); 
            if(this.state.title === 'Session Timer') {
              this.setState({
                title: 'Break Timer', 
                remainingTime: this.state.breakLength * 60
              }); 
            } else if(this.state.title === 'Break Timer') {
              this.setState({
                title: 'Session Timer', 
                remainingTime: this.state.workLength * 60 
              }); 
            }
          } else {
            this.setState({
              remainingTime: this.state.remainingTime - 1
            }); 
          }
        }, 1000)
      })
    }
  }

  resetHandler() {
    this.stopIt(); 
    this.setState({
      workLength: 25, 
      breakLength: 5, 
      remainingTime: 1500, 
      title: 'Session Timer', 
      interval: null
    })
  }

  showInstructionsHandler() {
    this.setState({
      showInstructions: !this.state.showInstructions
    })
  }

  getExtendedState(state) { 
    return {
      timerColor: state.remainingTime >= 60 ? 'white-timer' : 'red-timer',  
      timerTitleColor: state.title === 'Session Timer' ? 'session-timer-class' : 'break-timer-class', 
      showOrHideButtonName: state.showInstructions === true ? 'HIDE ME' : 'SHOW ME INSTRUCTIONS',
      showOrHideClasses: state.showInstructions === true ? 'show-instructions' : 'hide-instructions', 
      playOrPauseClasses: this.isPlaying(state) === true ? 
          ['playButton hideButton fas fa-pause', 
           'pauseButton showButton'] : 
          ['playButton showButton fas fa-play', 
           'pauseButton hideButton'], 
      };
  }

  render () {
    const extendedState = this.getExtendedState(this.state);
    const timeConvert = (num) => {
      let minutes = Math.floor(num / 60); 
      let seconds = num % 60; 
      if(seconds < 10) {
        seconds = '0' + seconds
      }; 
      if(minutes < 10) {
        minutes = '0' + minutes
      }; 
      return minutes + ' : ' + seconds; 
    }; 
    const convertedRemainingTime = timeConvert(this.state.remainingTime); 
    return (
      <div className="App">
        <div className='intro'>
          <h1> Pomodoro Clock </h1>
          <p> A powerful time management tool to help you improve efficiency by following pre-set work-break intervals. </p>
          <button onClick={this.showInstructionsHandler}> {extendedState.showOrHideButtonName} </button>
          <ul className = {extendedState.showOrHideClasses}>
            <li>Set work and break time lengths</li>
            <li><i class="fas fa-chevron-circle-down"></i></li>
            <li>Press START and start working (max work time: 60 minutes) </li>
            <li><i class="fas fa-chevron-circle-down"></i></li>
            <li>When hearing a beep sound, stop to take a break (max break time: 30 minutes)</li>
            <li><i class="fas fa-chevron-circle-down"></i></li>
            <li>When hearing a beep sound again, go back to work</li>
            <li><i class="fas fa-chevron-circle-down"></i></li>
            <li>Repeat step 3 and 4 until your task is finished or as desired</li>
            <li><i class="fas fa-chevron-circle-down"></i></li>
            <li>Press STOP and get a beer!</li>
          </ul>
        </div>
        <div className='length-control'>
          <div className='work-length-control'>
            <h2> Session Length</h2>
            <i className="fas fa-minus-circle" onClick={this.workLengthDecreaseHandler}></i> 
            <span>{this.state.workLength}</span>
            <i className="fas fa-plus-circle" onClick={this.workLengthIncreaseHandler}></i>          
          </div>
          <div className='break-length-control'>
            <h2> Break Length</h2>
            <i className="fas fa-minus-circle" onClick={this.breakLengthDecreaseHandler}></i>
            <span>{this.state.breakLength}</span>
            <i className="fas fa-plus-circle" onClick={this.breakLengthIncreaseHandler}></i>
          </div>
        </div> 
        <div className='timer'>
          <div className='timer-title'>
            <h3 className={extendedState.timerTitleColor}>{this.state.title}</h3>
          </div>
          <div className='remaining-time'>
            <h4 className={extendedState.timerColor}>{convertedRemainingTime}</h4>
          </div>
        </div>
        <div className='play-buttons'>
          <i className={extendedState.playOrPauseClasses[0]} onClick={this.playOrPauseHandler}></i>
          <i className={extendedState.playOrPauseClasses[1]}></i>
          <i className="fas fa-sync-alt" onClick={this.resetHandler}></i>
        </div>
        <footer>
          <p>Designed and coded by</p>
          <p>Hanna Yang</p>
        </footer>
        <audio id="beep" src="https://goo.gl/65cBl1" />
      </div>
    );
  }; 
}; 

export default App;
