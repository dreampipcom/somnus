import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const playIcon = require('../img/ic_play_arrow_white_48pt.png')
const stopIcon = require('../img/ic_pause_white_48pt.png')

interface IControls {
  paused?: boolean;
  shuffleOn?: boolean;
  repeatOn?: boolean;
  isPlaying: boolean;
  loading: boolean;
  onPressPlay?(): void;
  onPressPause?(): void;
  onBack?(): void;
  onForward?(): void;
  onPressShuffle?(): void;
  onPressRepeat?(): void;
  forwardDisabled?: boolean;
}

const Controls = ({
  paused,
  shuffleOn,
  repeatOn,
  isPlaying,
  loading,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  onPressShuffle,
  onPressRepeat,
  forwardDisabled,
}: IControls) => (
  <View style={styles.container}>
    <View style={{width: 20}} />
    {loading && (
            <View>
              <Text style={styles.message}>LOADING PLAYER...</Text>
            </View>
          )}
    {!loading && (isPlaying ? (
            <View style={styles.playButton}>
              <Image source={stopIcon} />
            </View>
          ) : (
              <View style={styles.playButton}>
                <Image source={playIcon} />
              </View>
            ))}
    <View style={{width: 20}} />
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
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
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  },
  message: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: 'bold',
    fontSize: 10,
  }
})