import React from 'react';
import './playlist.css';

const Playlist = ({ title, src, id, playSong, color, artist }) => {
  const clickHandler = (src, id) => {
    playSong(src, id);
  };

  return (
    <button
      className="song-btn"
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
