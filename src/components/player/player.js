import React, { useState } from 'react';
import './player.css';
import { play, pause, next, previous, shuffle, volume, mute, repeat } from './controls';

const Player = props => {
  const {
    isPlaying,
    togglePlaying,
    seek,
    moveBar,
    duration,
    playNext,
    playPrevious,
    shuffleList,
    isShuffled,
    changeVol,
    repeatSong,
    isRepeat,
    songVolume
  } = props;

  const playPauseSwitch = isPlaying ? pause : play;
  const selector = React.createRef();
  const [volumeLevel, setVolume] = useState(songVolume || 0.5);
  const [isMute, setMute] = useState(false);
  const [volClass, setClass] = useState(volume);
  const [color, setColor] = useState('');

  const timePrettier = time => {
    let min = [0, Math.floor(time / 60)];
    let sec = [0, Math.floor(time - min[1] * 60)];
    let dMin = min[1] < 10 ? min.join('') : min[1];
    let dSec = sec[1] < 10 ? sec.join('') : sec[1];
    return dMin + ':' + dSec;
  };

  const displayDuration = timePrettier(duration);
  const displaySeek = timePrettier(parseInt(seek));

  return (
    <div className="player-controls">
      <button
        className={`player-btn ${isShuffled ? 'fill-color' : 'controls'}`}
        onClick={() => shuffleList()}
      >
        <i className={shuffle} aria-hidden="true"></i>
      </button>
      <button className="player-btn controls" onClick={() => playPrevious()}>
        <i className={previous} aria-hidden="true"></i>
      </button>
      <button
        className="player-btn play"
        onClick={() => {
          togglePlaying();
        }}
      >
        <i className={playPauseSwitch} aria-hidden="true"></i>
      </button>
      <button className="player-btn controls" onClick={() => playNext()}>
        <span className={next} aria-hidden="true"></span>
      </button>
      <div className="slider">
        <span className="player-btn seek">{displaySeek}</span>
        <input
          className="progress-bar"
          type="range"
          name="progressBar"
          ref={selector}
          value={seek}
          max={duration}
          onChange={e => {
            moveBar(parseInt(e.target.value) || seek);
          }}
        ></input>
        <span className="song-duration player-btn">{displayDuration}</span>
      </div>
      <button
        className={`player-btn ${isRepeat ? 'fill-color' : 'controls'}`}
        onClick={() => repeatSong()}
      >
        <i className={repeat}></i>
      </button>

      <button
        className="player-btn volume-btn controls"
        onClick={() => {
          setMute(isMute => !isMute);
          isMute ? setClass(volume) : setClass(mute);
          setVolume(+isMute / 2);
          changeVol(+isMute / 2);
        }}
      >
        <i className={volClass} aria-hidden="true"></i>
      </button>
      <input
        className={`volume-range ${color}`}
        type="range"
        name="volume"
        value={volumeLevel}
        min="0"
        max="1"
        step="0.1"
        onChange={e => {
          if (e.target.value <= 0) {
            setClass(mute);
            setMute(true);
            setVolume(0);
            changeVol(0);
          } else {
            setMute(false);
            setVolume(e.target.value);
            changeVol(e.target.value);
            setClass(volume);
            setColor('color');
          }
        }}
      ></input>
    </div>
  );
};

export default Player;
