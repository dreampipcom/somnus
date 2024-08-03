export const switchPlayer = () => (
  {
    type: 'SWITCH_PLAYER',
  }
);
export const loadPlayer = (player: any) => (
  {
    type: 'LOAD_PLAYER',
    payload: player
  }
);
export const updateDetails = (tracks: any, artist: string, artwork: string) => (
  {
    type: 'UPDATE_DETAILS',
    payload: {
      tracks,
      artist,
      artwork,
    }
  }
);
export const togglePlay = ({ play }) => (
  {
    type: 'TOGGLE_PLAY',
    payload: {
      play
    }
  }
);
export const refreshView = (view) => {
  return {
    type: 'REFRESH_VIEW',
    payload: {
      view
    }
  }
}