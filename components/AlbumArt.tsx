import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface IAlbumArt {
  url: string;
  channel: string;
  isLive?: boolean;
  onPress?(): void;
}

const AlbumArt = ({
  url,
  channel,
  isLive = false,
  onPress
}: IAlbumArt) => (
  <View style={styles.container}>
    <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={onPress}>
      {isLive ? (
        <WebView
          scalesPageToFit={true}
          bounces={false}
          javaScriptEnabled
          style={styles.image}
          allowsInlineMediaPlayback
          source={{ uri:"https://www.dreampip.com/embed" }}
          automaticallyAdjustContentInsets={false}
        />
      ) : (
        <Image
          style={styles.image}
          resizeMode="contain"
          source={url ? {
            uri: url,
          } : require('../img/icon.png')}
        />
      )}
    </TouchableOpacity>
  </View>
);

export default AlbumArt;

const { width, height } = Dimensions.get('window');
const imageSize = width - 48;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  image: {
    width: imageSize,
    height: imageSize,
    backgroundColor: 'white'
  },
  video: {
    width: imageSize,
    height: imageSize,
  }
})