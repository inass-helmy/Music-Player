import React from 'react';
import './nowPlaying.css';

const NowPlaying = ({ color, description, userName, nowPlayingSong, artist }) => {
  return (
    <div className="nowplaying-song" style={{ backgroundColor: color }}>
      <h2 className="song-name">
        {nowPlayingSong.songName}
        <br />
        <span className="artist">{artist}</span>
      </h2>

      <p className="song-info">{nowPlayingSong.description}</p>
    </div>
  );
};

export default NowPlaying;
