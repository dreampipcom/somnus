import TrackPlayer, { Capability } from 'react-native-track-player';
import registerRootComponent from 'expo/build/launch/registerRootComponent';

import App from './App';
import { PlaybackService } from './service';

registerRootComponent(App);

TrackPlayer.registerPlaybackService(() => PlaybackService);
