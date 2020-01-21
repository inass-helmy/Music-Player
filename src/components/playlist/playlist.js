import React from 'react';
import './playlist.css';

const Playlist = ({ title, src, id, playSong, color, artist, isClicked }) => {
  const clickHandler = (src, id) => {
    playSong(src, id);
  };

  const justify = `song-btn ${isClicked ? 'shift-right' : 'auto'}`;

  return (
    <button
      className={justify}
      style={{ backgroundColor: color }}
      onClick={() => clickHandler(src, id)}
    >
      <h2 className="song-name">
        {title}
        <br />
        <span className="artist">{artist}</span>
      </h2>
    </button>
  );
};
export default Playlist;
