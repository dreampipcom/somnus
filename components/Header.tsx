import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { refreshView } from '../redux/PlayerActions';
import { connect } from 'react-redux';

interface IHeader {
  message: string;
  onDownPress?(): void;
  onQueuePress?(name?: string): void;
  onMessagePress?(): void;
}

const mapDispatchToProps = {
  refreshView
}

const connector = connect(null, mapDispatchToProps)

const Header = ({
  message,
  onDownPress,
  onQueuePress,
  onMessagePress,
  refreshView,
}: IHeader) => (
  <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={onDownPress}>
      {/* <Image style={styles.button}
        source={require('../img/ic_keyboard_arrow_down_white.png')} /> */}
    </TouchableOpacity>
    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Text onPress={onMessagePress}
      style={styles.message}>{message.toUpperCase()}</Text>
    {message !== 'Player' && (<TouchableOpacity onPress={() => refreshView(message.toLocaleLowerCase())} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <Image style={styles.button}
        source={require('../img/ic_repeat_white.png')} />
    </TouchableOpacity>)}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgb(31,31,31)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: 'bold',
    fontSize: 10,
  },
  button: {
    opacity: 0.72
  }
});

export default connector(Header)
