import React, { Component } from 'react';
import './App.css';
import Playlist from '../components/playlist/playlist';
import Player from '../components/player/player';
import NowPlaying from '../components/nowPlaying/nowPlaying';
import { Howl } from 'howler';
import { colors } from '../assets/colors';

let song = null;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isPlaying: song != null ? song.playing() : false,
      isClicked: false,
      isRepeat: false,
      isShuffled: false,
      headerClass: 'transparent',
      seek: 0,
      duration: 0,
      currentIndex: 0,
      shuffleIndex: 0,
      isPaused: false,
      volume: song === null ? 0.5 : song.volume(),
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
        const songsColors = colors.splice(0, json.length);

        const data = json.map((song, index) => {
          return {
            songName: song.upload_name,
            id: song.upload_id,
            url: song.files[0].download_url,
            description: song.upload_description_plain,
            artist: song.user_name,
            color: songsColors[index]
          };
        });
        this.setState({ isLoaded: true, data });
      });

    window.addEventListener('scroll', this.listenToScroll);
  }

  listenToScroll = e => {
    if (window.scrollY < 50) {
      this.setState({ headerClass: 'transparent' });
    } else if (window.scrollY > 100 && window.scrollY < 150) {
      this.setState({ headerClass: 'in-between' });
    } else {
      this.setState({ headerClass: 'obaque' });
    }
  };

  playSong = (src, id) => {
    //check if song is null, if not stop previous song and unload it
    if (song != null) {
      song.stop();
      song.unload();
      song = null;
    }
    const { data, isRepeat, volume } = this.state;
    const temp = data.filter(song => song.id !== id);
    const currentIndex = data.findIndex(song => song.id === id);
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
      volume: volume,
      loop: isRepeat,
      preload: true,
      onload: () => {
        this.setState({ duration: Math.floor(song.duration()), seek: 0 });
      },
      onplay: function() {
        setInterval(() => {
          this.setState({ seek: parseInt(song.seek()) });
        }, 1000);
      }.bind(this),
      onend: function() {
        isRepeat ? song.play() : this.playNextSong();
      }.bind(this)
    });
    song.play();
  };

  playNextSong = () => {
    this.setState({ seek: 0 });
    const { currentIndex, data, isShuffled, shuffledList, shuffleIndex, isRepeat } = this.state;
    let nextSong;
    if (isRepeat) {
      nextSong = data[currentIndex];
      this.playSong(nextSong.url, nextSong.id);
      return;
    } else if (isShuffled) {
      nextSong = data[shuffledList[shuffleIndex]];
      this.setState({
        shuffleIndex: this.state.shuffleIndex === data.length - 1 ? 0 : this.state.shuffleIndex + 1
      });
      this.playSong(nextSong.url, nextSong.id);
    } else {
      nextSong = currentIndex === data.length - 1 ? data[0] : data[currentIndex + 1];
      this.playSong(nextSong.url, nextSong.id);
    }
  };

  playPreviousSong = () => {
    this.setState({ seek: 0 });

    const { currentIndex, data, isShuffled, shuffledList, shuffleIndex, isRepeat } = this.state;
    let prevSong;
    if (isRepeat) {
      prevSong = data[currentIndex];
      this.playSong(prevSong.url, prevSong.id);
    } else if (isShuffled) {
      prevSong = data[shuffledList[shuffleIndex]];
      this.setState({
        shuffleIndex: this.state.shuffleIndex === 0 ? data.length - 1 : this.state.shuffleIndex - 1
      });
      this.playSong(prevSong.url, prevSong.id);
    } else {
      prevSong = currentIndex === 0 ? data[data.length - 1] : data[currentIndex - 1];
      this.playSong(prevSong.url, prevSong.id);
    }
  };

  togglePlaying = () => {
    const { data, isClicked } = this.state;
    this.state.isPlaying
      ? song.pause()
      : isClicked
      ? song.play()
      : this.playSong(data[0].url, data[0].id);

    this.setState({
      isPlaying: !this.state.isPlaying
    });
  };

  moveBar = position => {
    this.setState({
      seek: parseInt(position)
    });
    song.seek(parseInt(position));
  };

  shuffleList = () => {
    const { data, currentIndex } = this.state;
    let i = data.length;
    let list = [];
    while (--i > 0) {
      let index = Math.round(Math.random() * (i + 1));
      list.push(index);
    }
    this.setState({
      shuffledList: list,
      isShuffled: !this.state.isShuffled,
      shuffleIndex: currentIndex
    });
  };
  setVolume = vol => {
    if (song != null) {
      vol === 0 ? song.mute(true) : song.mute(false);
      song.volume(vol);
    } else {
      this.setState({ volume: vol });
    }
  };

  repeatSong = () => {
    this.setState({ isRepeat: !this.state.isRepeat });
  };
  render() {
    const {
      data,
      isClicked,
      displayList,
      isLoaded,
      isPlaying,
      seek,
      duration,
      currentIndex,
      isShuffled,
      headerClass,
      isRepeat,
      volume
    } = this.state;
    const display = isClicked && isLoaded ? displayList : data;
    const justify = isClicked ? 'title-tracks-shift' : 'title-tracks-auto';

    return (
      this.state.isLoaded && (
        <div className="container">
          <header className={headerClass}>
            {(isClicked || isPlaying) && <h4 className="title title-nowplaying">NOW PLAYING</h4>}
            <h4 className={`title ${justify}`}>AVAILABLE SOUNDTRACKS</h4>
          </header>
          <div className="playlist">
            {(isClicked || isPlaying) && (
              <div className="now-playing clicked">
                <NowPlaying className="now-playing " nowPlayingSong={data[currentIndex]} />
              </div>
            )}
            <div className="audio-tracks">
              {display.map(song => {
                return (
                  <Playlist
                    key={song.id}
                    src={song.url}
                    title={song.songName}
                    id={song.id}
                    artist={song.artist}
                    playSong={this.playSong}
                    color={song.color}
                    isClicked={isClicked}
                  />
                );
              })}
            </div>
          </div>
          <footer>
            <Player
              isPlaying={isPlaying}
              togglePlaying={this.togglePlaying}
              seek={seek}
              duration={duration}
              moveBar={this.moveBar}
              songDuration={duration}
              playNext={this.playNextSong}
              playPrevious={this.playPreviousSong}
              shuffleList={this.shuffleList}
              isShuffled={isShuffled}
              changeVol={this.setVolume}
              repeatSong={this.repeatSong}
              isRepeat={isRepeat}
              songVolume={volume}
            />
          </footer>
        </div>
      )
    );
  }
}

export default App;
