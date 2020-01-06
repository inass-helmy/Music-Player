import React from 'react';
import './player.css';
import { play, pause, next, previous } from './controls';

const Player = props => {
  const {
    isPlaying,
    playFirstSong,
    firstSong,
    pauseSong,
    togglePlaying,
    resumeSong,
    isClicked,
    seek,
    moveBar,
    duration,
    playNext,
    playPrevious
  } = props;

  const playPauseSwitch = isPlaying ? pause : play;
  const selector = React.createRef();

  const switchPlayPause = () => {
    togglePlaying();
    isPlaying ? pauseSong() : isClicked ? resumeSong() : playFirstSong(firstSong.url, firstSong.id);
  };

  return (
    <div className="player-controls">
      <button className="player-btn" onClick={() => playPrevious()}>
        <i className={previous} aria-hidden="true"></i>
      </button>
      <button
        className="player-btn"
        onClick={() => {
          switchPlayPause();
        }}
      >
        <i className={playPauseSwitch} aria-hidden="true"></i>
      </button>
      <button className="player-btn" onClick={() => playNext()}>
        <span className={next} aria-hidden="true"></span>
      </button>
      <progress
        ref={selector}
        className="slider"
        value={seek}
        max={duration}
        onClick={e => {
          var rect = selector.current.getBoundingClientRect();
          var percentage = (e.clientX - rect.left) / selector.current.offsetWidth;
          moveBar(percentage * 100);
        }}
      ></progress>
    </div>
  );
};

export default Player;
