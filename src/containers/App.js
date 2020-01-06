import React, { Component } from 'react';
import './App.css';
import Playlist from '../components/playlist/playlist';
import Player from '../components/player/player';
import NowPlaying from '../components/nowPlaying/nowPlaying';
import { Howl } from 'howler';

let song = null;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isPlaying: false,
      isClicked: false,
      shuffled: false,
      seek: 0,
      duration: 0,
      currentIndex: 0,
      song: { id: 0, songName: '', url: '', description: '', artist: '' },
      data: [],
      displayList: [],
      shuffledList: []
    };
  }

  componentDidMount() {
    fetch(
      'http://ccmixter.org/api/query?f=json&datasource=topics&type=artist_qa&u=victor&limit=10',
      {
        headers: { accept: 'application/json' }
      }
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const data = json.map(song => {
          return {
            songName: song.upload_name,
            id: song.upload_id,
            url: song.files[0].download_url,
            description: song.upload_description_plain,
            artist: song.user_name
          };
        });
        this.setState({ isLoaded: true, data });
      });
  }

  playSong = (src, id) => {
    //check if song is null, if not stop previous song and unload it
    if (song != null) {
      song.stop();
      song.unload();
      song = null;
    }
    const { data } = this.state;
    const temp = data.filter(song => song.id !== id);
    const currentIndex = data.findIndex(song => song.id === id);
    console.log('index', currentIndex);
    this.setState({
      currentIndex,
      currentSrc: src,
      isPlaying: true,
      isClicked: true,
      displayList: temp
    });
    song = new Howl({
      src,
      html5: true,
      onload: () => {
        this.setState({ duration: song.duration() });
      },
      onplay: function() {
        this.setState({ seek: song.seek() });
        setInterval(() => {
          this.setState({ seek: Math.round(song.seek() || 0) });
        }, 1000);
      }.bind(this),
      onend: function() {
        this.playNextSong();
      }.bind(this)
    });
    song.play();
  };

  playNextSong = () => {
    this.setState({ seek: 0 });
    const { currentIndex, data } = this.state;
    const nextSong = currentIndex === data.length - 1 ? data[0] : data[currentIndex + 1];
    this.playSong(nextSong.url, nextSong.id);
  };

  playPreviousSong = () => {
    this.setState({ seek: 0 });
    const { currentIndex, data } = this.state;
    const previousSong = currentIndex === 0 ? data[data.length - 1] : data[currentIndex - 1];
    this.playSong(previousSong.url, previousSong.id);
  };

  pauseSong = () => {
    if (this.state.isPlaying) {
      song.pause();
    }
  };

  togglePlaying = () => {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  };

  resumeSong = () => {
    song.play();
  };

  moveBar = position => {
    const { duration } = this.state;
    this.setState({
      seek: (position * duration) / 100
    });
    song.seek((position * duration) / 100);
  };

  render() {
    const colors = [
      '#581845',
      '#900c3f',
      '#c70039',
      '#c0392b',
      '#900c3f',
      '#58355e',
      '#cc0000',
      '#f4511e',
      '#c0392b',
      '#c70039'
    ];
    const {
      data,
      isClicked,
      displayList,
      isLoaded,
      isPlaying,
      seek,
      duration,
      currentIndex
    } = this.state;
    const display = isClicked && isLoaded ? displayList : data;

    return (
      this.state.isLoaded && (
        <div className="container">
          <div className="audio-tracks">
            <div className="playlist">
              <h4 className="title">AVAILABLE SOUNDTRACKS</h4>
              {display.map((song, index) => {
                return (
                  <Playlist
                    key={song.id}
                    src={song.url}
                    title={song.songName}
                    id={song.id}
                    artist={song.artist}
                    playSong={this.playSong}
                    color={colors[index]}
                  />
                );
              })}
            </div>
            {(isClicked || isPlaying) && (
              <div className="now-playing">
                <h4 className="title">NOW PLAYING</h4>
                {<NowPlaying nowPlayingSong={data[currentIndex]} color={colors[currentIndex]} />}
              </div>
            )}
          </div>
          <Player
            firstSong={data[0]}
            playFirstSong={this.playSong}
            resumeSong={this.resumeSong}
            pauseSong={this.pauseSong}
            isPlaying={isPlaying}
            isClicked={isClicked}
            togglePlaying={this.togglePlaying}
            seek={seek}
            duration={duration}
            moveBar={this.moveBar}
            songDuration={Math.round(duration)}
            playNext={this.playNextSong}
            playPrevious={this.playPreviousSong}
          />
        </div>
      )
    );
  }
}

export default App;
