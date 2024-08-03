import { combineReducers } from 'redux';

const INITIAL_STATE = {
  isPlaying: false,
  channel: 0,
  artist: "Loading...",
  track: 'Loading...',
  otherTrack: 'Loading...',
  player: undefined,
  refresh: {
    chat: {
      name: 'chat',
      date: new Date().getTime().toString()
    },
    shows: {
      name: 'shows',
      date: new Date().getTime().toString()
    },
    episodes: {
      name: 'episodes',
      date: new Date().getTime().toString()
    },
    events: {
      name: 'events',
      date: new Date().getTime().toString()
    },
    blog: {
      name: 'blog',
      date: new Date().getTime().toString()
    }
  }
};

export const playerReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case "SWITCH_PLAYER": {
      return { ...state, channel: 0 }
    }
    case "TOGGLE_PLAY": {
      return { ...state, isPlaying: action?.payload?.play || false }
    }
    case "UPDATE_DETAILS": {
      return { ...state, artist: action.payload.artist, track: action.payload.tracks.currentTrack, otherTrack: action.payload.tracks.otherTrack, artwork: action.payload.artwork }
    }
    case "REFRESH_VIEW": {
      return { ...state, refresh: { ...state.refresh, [action.payload.view]: { ...state.refresh[action.payload.view], date: new Date().getTime().toString() } } }
    }
    case "LOAD_PLAYER": {
      return { ...state, player: true}
    }
    default:
      return state
  }
};

export default playerReducer;