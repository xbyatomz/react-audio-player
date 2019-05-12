import React from 'react'

class Player extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isPlaying: false,
        }

        this.play = this.play.bind(this)
        this.pause = this.pause.bind(this)
        this.updateProgress = this.updateProgress.bind(this)
        this.seek = this.seek.bind(this)
        this.handleVolume = this.handleVolume.bind(this)
    }

    calculateTotalValue(length) {
        var minutes = Math.floor(length / 60),
          seconds_int = length - minutes * 60,
          seconds_str = seconds_int.toString(),
          seconds = seconds_str.substr(0, 2),
          time = minutes + ':' + seconds
      
        return time;
    }

    calculateCurrentValue(currentTime) {
        var current_hour = parseInt(currentTime / 3600) % 24,
          current_minute = parseInt(currentTime / 60) % 60,
          current_seconds_long = currentTime % 60,
          current_seconds = current_seconds_long.toFixed(),
          current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);
      
        return current_time;
      }

    play() {
        console.info('play()', 'Play button pressed')
        this.refs.player.play()
        this.setState({
            isPlaying: true,
        })
        this.updateProgress()
    }

    pause() {
        console.info('pause()', 'Pause button pressed')
        this.refs.player.pause()
        this.setState({
            isPlaying: false,
        })
    }

    updateProgress() {
        const {duration, currentTime} = this.refs.player
        let trackDuration = this.calculateTotalValue(duration)
        let trackTime = this.calculateCurrentValue(currentTime)
        this.refs.duration.innerHTML = trackDuration
        this.refs.elapsed.innerHTML = trackTime

        this.refs.progress.value = (currentTime / duration)
    }

    seek(evt) {
        this.setState({
            isPlaying: false,
        }, () => {
            this.refs.player.pause()
        })
        var percent = evt.nativeEvent.offsetX / this.refs.progress.offsetWidth;
        this.refs.player.currentTime = percent * this.refs.player.duration;
        this.refs.progress.value = percent / 100;
        this.setState({
            isPlaying: true
        }, () => {
            this.refs.player.play()
        })
    }

    handleVolume(e) {
        this.refs.player.volume = e.target.value / 100
    }

    render() {
        const {isPlaying} = this.state
        return (
            <div>
                <p>Audio Player</p>
                {
                    isPlaying ? 
                    (
                        <button onClick={this.pause}>Pause</button>
                    )
                    :
                    (
                        <button onClick={this.play}>Play</button>
                    )
                }
                <audio id="player" ref="player" onTimeUpdate={this.updateProgress}>
                    <source src={require('../assets/test.mp3')}/>
                </audio>
                <progress ref="progress" value="0" max="1" onClick={this.seek}></progress>
                <div className="duration">
                    <p><span ref="elapsed">0:00</span>/<span ref="duration">0:00</span></p>
                </div>
                <input type="range" min="0" max="100" defaultValue="100" onChange={this.handleVolume}/>
            </div>
        )
    }
}

export default Player