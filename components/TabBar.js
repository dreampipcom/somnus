import { View, Text, TouchableOpacity } from 'react-native';
import { useBackground } from '../hooks/useBackground';
import { refreshView } from '../redux/PlayerActions';
import { useActive } from '../hooks/useActive';
import { useRef, useState } from 'react';
import { connect } from 'react-redux';

const mapDispatchToProps = {
  refreshView
}

const connector = connect(null, mapDispatchToProps)

function MyTabBar({ state, descriptors, navigation, refreshView }) {
  const backgroundTimer = useRef(undefined)

  useBackground(() => {
    backgroundTimer.current = new Date().getTime()
  }, [])

  useActive(function () {
    if (new Date().getTime() - backgroundTimer.current > 60000 * 15) {
      navigation.navigate('Player')
      refreshView("blog")
      refreshView("chat")
      refreshView("episodes")
      refreshView("shows")
      refreshView("events")
    }
  }, [backgroundTimer.current])

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, height: 80, backgroundColor: isFocused ? 'white' : '#1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: isFocused ? '#1f1f1f' : 'white', fontSize: 9 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

module.exports = {
  MyTabBar: connector(MyTabBar)
} 