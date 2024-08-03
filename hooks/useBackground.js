
import React, { useEffect } from 'react';
import { AppState } from 'react-native';

export function useBackground(action, deps = []) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        nextAppState === 'background'
      ) {
        action()
      }

      return () => {
        subscription.remove();
      };
    });
  }, deps)

  return;
}
