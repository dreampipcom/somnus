import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { updateDetails } from '../redux/PlayerActions';
import TrackPlayer from 'react-native-track-player';
import {decode} from 'html-entities';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const mapStateToProps = (state) => {
  return {
    artist: state.artist,
    track: state.track,
    artworkState: state.artwork,
    otherTrackState: state.otherTrack,
    loaded: state.player,
  };
};

const mapDispatchToProps = {
  updateDetails,
};

interface ITrackDetails {
  title?: string;
  artist?: string;
  channel?: string;
  onAddPress?(): void;
  onMorePress?(): void;
  onTitlePress?(): void;
  onArtistPress?(): void;
}

const TrackDetails = ({
  title,
  track,
  artist,
  artworkState,
  channel,
  updateDetails,
  onAddPress,
  onMorePress,
  onTitlePress,
  onArtistPress,
  otherTrackState,
  loaded,
}: any) => {

// loading
  const [current, setCurrent] = useState("Dream, Vibe, ...Pip!")
  const [other, setOther] = useState("Dream, Vibe, ...Pip!")

  const fetchData = async () => {
    var currentTrack;
    var otherTrack;
    var artwork;

    // var url1 = "https://www.dreampip.com/api/nexus/audio-info"
    // const req1 = await fetch(url1)
    // const res1 = await req1.json()
    const DEFAULT = "Dream, Vibe, ...Pip!"
    // const show = res1?.shows?.current?.name.startsWith(DEFAULT) && res1?.tracks?.current?.metadata?.artist_name?.includes("(Repeats)") ? res1?.tracks?.current?.metadata?.artist_name : res1?.shows?.current?.name
    // currentTrack = decode(show)
    // artwork = res1.shows.current.image_path
    setCurrent(DEFAULT)
        
    // const req2 = await fetch(url2)
    // const res2 = await req2.json()
    // otherTrack = decode(res2.shows.current.name)
    // // artwork = res2.shows.current.image_path
    // setOther(currentTrack)
    
    if (track !== currentTrack || otherTrack !== otherTrackState)
    updateDetails({ currentTrack, otherTrack }, "Dream, Vibe, ...Pip!", artwork)
  }

  useEffect(() => {
    fetchData()
    const timer = setInterval(function () {
      fetchData()
    }, 20000);
    return () => clearInterval(timer);
  }, [channel]);

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    if(!loaded) return
    TrackPlayer.updateMetadataForTrack(channel, { title: track, artist: 'Dream, Vibe, ...Pip!,', artwork: artworkState || require('../img/icon.png') })
  }, [track, artist, artworkState])

  return (
    <View style={styles.container}>
      <View style={styles.detailsWrapper}>
        <Text style={styles.artist} onPress={onTitlePress}>Dream Vibe Modulator</Text>
        <Text style={styles.title} onPress={onTitlePress}>{current}</Text>
      </View>
    </View>
  )
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackDetails);

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    paddingRight: 20,
  },
  detailsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  artist: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    opacity: 0.72,
  },
  moreButton: {
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 2,
    opacity: 0.72,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonIcon: {
    height: 17,
    width: 17,
  }
});