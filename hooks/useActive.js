
import React, { useEffect } from 'react';
import { AppState } from 'react-native';

export function useActive(action, deps = []) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        nextAppState === 'active'
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
