import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import Controls from './Controls';
import { connect } from 'react-redux';
import { togglePlay, loadPlayer, switchPlayer } from '../redux/PlayerActions';
import TrackPlayer, { usePlaybackState, State, Capability, setupPlayer, updateOptions } from 'react-native-track-player';
import axios from 'axios';

const mapStateToProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    channel: state.channel,
    artist: state.artist,
    track: state.track,
    otherTrack: state.otherTrack,
    artwork: state.artwork,
  };
};

const mapDispatchToProps = {
  switchPlayer,
  loadPlayer,
  togglePlay,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const Player = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamingVideo, setIsStreamingVideo] = useState(false);
  const [twitchToken, setTwitchToken] = useState("");
  const playerState = usePlaybackState();

  const state = playerState?.state || playerState

  useEffect(() => {
    if (state == 'ready' || state == 8 || state == State.Ready) {
      setIsLoading(false);

    }
    if (state == State.Playing) {
      console.log("sending play")
      props.togglePlay({ play: true })
    }
    if (state == State.Paused) {
      console.log("sending pause")
      props.togglePlay({ play: false })
    }
  }, [state]);

  // useEffect(() => {
  //   console.log({ isLoading})
  // }, [isLoadirng])

  // useEffect(() => {
  //   if (props.channel) {
  //     loadAudio()
  //     //TrackPlayer.skip(props.channel);
  //   }
  // }, [props.channel]);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (e) {
      await setupPlayer()
    }
    try {
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          Capability?.Play,
          Capability?.Pause,
        ],
        compactCapabilities: [
          Capability?.Play,
          Capability?.Pause,
        ],
        notificationCapabilities: [
          Capability?.Play,
          Capability?.Pause,
        ],
      });
      TrackPlayer.setVolume(1);
    } catch (e) {
      await setupPlayer()
    }
  }

  const queueTracks = async () => {
    try {
      await TrackPlayer.add([
        {
          url: 'https://www.dreampip.com/api/nexus/audio',
          title: props.track,
          artist: props.artist,
          artwork: props.artwork,
          channel: 0
        },
      ]);
      // await TrackPlayer.add();
    } catch (e) {
      await queueTracks()
    }
  }

  const loadAudio = async () => {
    setIsLoading(true);
    await setupPlayer()
    await queueTracks();
  };

  const handlePlayPause = async () => {
    if (props.isPlaying) {
      await TrackPlayer.pause();
    } else {
      // await TrackPlayer.play();
      if (Platform.OS === 'ios') {
        //setIsLoading(true);
        setTimeout(async () => {
          await TrackPlayer.play();
          setIsLoading(false);
        }, 500);
      } else {
        await TrackPlayer.play();
      }r
    }
  };

  const switchChannel = async () => {
    props.isPlaying ? await handlePlayPause() : undefined;
    await TrackPlayer.destroy();
    await loadAudio();
    props.switchPlayer();
  };

  const openSite = async () => {
    try {
      await Linking.openURL("https://www.dreampip.com");
    } catch (e) {
      console.error(e)
    }
  }

  const checkLive = async () => {
    try {
      const auth = `https://www.dreampip.com/api/checklive`;
      const token = await axios.get(auth);
      const status = token?.data?.status
      if (status === 'RUNNING') {
        setIsStreamingVideo(true)
      } else {
        setIsStreamingVideo(false)
      }
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    try {
      loadAudio();
    } catch (e) {
      console.log('initial', e);
    }

    checkLive();

    const interval = setInterval(checkLive, 60000 * 1);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden={true} />
      <AlbumArt url={props.artwork} channel={props.channel} isLive={isStreamingVideo} />
      <TrackDetails channel={props.channel} />
      <TouchableOpacity onPress={handlePlayPause}>
        <Controls loading={isLoading} isPlaying={props.isPlaying} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default connector(Player);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(31,31,31)',
    paddingTop: 48
  },
  audioElement: {
    height: 0,
    width: 0,
  },
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: 'bold',
    fontSize: 12,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 32,
    padding: 32,
  },
});
