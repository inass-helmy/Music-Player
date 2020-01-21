import React from 'react';
import './nowPlaying.css';

const NowPlaying = ({ nowPlayingSong }) => {
  return (
    <div
      className="nowplaying-song"
      style={{
        backgroundImage: `linear-gradient(26deg, #efefe1 0%, ${nowPlayingSong.color}  80%)`
      }}
    >
      <h2 className="song-name">
        {nowPlayingSong.songName}
        <br />
        <span className="artist">{nowPlayingSong.artist}</span>
      </h2>

      <p className="song-info">{nowPlayingSong.description}</p>
    </div>
  );
};

export default NowPlaying;
