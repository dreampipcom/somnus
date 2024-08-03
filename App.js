import { StyleSheet, Text, View, Linking, AppState, Platform, NativeModules } from 'react-native';
import Player from './components/Player';
import { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Website from './components/View';
import { MyTabBar } from './components/TabBar';
import { NavigationContainer } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import Header from './components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux'
import playerReducer from './redux/PlayerReducer';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { refreshView } from './redux/PlayerActions';
import { useActive } from './hooks/useActive';
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const store = createStore(playerReducer);

const localeMap = {
  "en": "en",
  "pt": "pt-br",
  "it": "it-it",
  "de": "de-de",
  "fr": "fr-fr",
  "es": "es-es",
  "ro": "ro",
  "pl": "pl-pl",
  "cz": "cs-cz",
  "se": "sv-se",
  "ee": "et-ee",
  "jp": "ja-jp"
};

const strings = {
  "en": {
    "player": "Player",
    "chat": "Chat",
    "episodes": "Episodes",
    "shows": "Shows",
    "events": "Events",
    "blog": "Blog"
  },
  "it-it": {
    "player": "Lettore",
    "chat": "Chat",
    "episodes": "Episodi",
    "shows": "Spettacoli",
    "events": "Eventi",
    "blog": "Blog"
  },
  "pt-br": {
    "player": "Reprodutor",
    "chat": "Chat",
    "episodes": "Episódios",
    "shows": "Programas",
    "events": "Eventos",
    "blog": "Blog"
  },
  "es-es": {
    "player": "Reproductor",
    "chat": "Chat",
    "episodes": "Episodios",
    "shows": "Programas",
    "events": "Eventos",
    "blog": "Blog"
  },
  "de-de": {
    "player": "Player",
    "chat": "Chat",
    "episodes": "Episoden",
    "shows": "Shows",
    "events": "Veranstaltungen",
    "blog": "Blog"
  },
  "fr-fr": {
    "player": "Lecteur",
    "chat": "Chat",
    "episodes": "Épisodes",
    "shows": "Émissions",
    "events": "Événements",
    "blog": "Blog"
  },
  "ro": {
    "player": "Player",
    "chat": "Chat",
    "episodes": "Episoade",
    "shows": "Emisiuni",
    "events": "Evenimente",
    "blog": "Blog"
  },
  "pl-pl": {
    "player": "Odtwarzacz",
    "chat": "Czat",
    "episodes": "Odcinki",
    "shows": "Programy",
    "events": "Wydarzenia",
    "blog": "Blog"
  },
  "cs-cz": {
    "player": "Přehrávač",
    "chat": "Chat",
    "episodes": "Díly",
    "shows": "Pořady",
    "events": "Události",
    "blog": "Blog"
  },
  "sv-se": {
    "player": "Spelare",
    "chat": "Chatt",
    "episodes": "Avsnitt",
    "shows": "Program",
    "events": "Evenemang",
    "blog": "Blogg"
  },
  "et-ee": {
    "player": "Mängija",
    "chat": "Jututuba",
    "episodes": "Episoodid",
    "shows": "Saated",
    "events": "Sündmused",
    "blog": "Blogi"
  },
  "ja-jp": {
    "player": "プレイヤー",
    "chat": "チャット",
    "episodes": "エピソード",
    "shows": "番組",
    "events": "イベント",
    "blog": "ブログ"
  }
}


const Tab = createBottomTabNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState(undefined)
  const [tracking, setTracking] = useState(false)
  const [notification, setNotification] = useState(false);
  const responseListener = useRef();
  const notificationListener = useRef();


  //locale
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  const locale = localeMap[deviceLanguage?.split("_")[0]?.toLowerCase()] || "en"
  const localization = strings[locale] || strings['en']


  // store key
  const storeLocalPush = async (value) => {
    try {
      await AsyncStorage.setItem('@push', value)
      await AsyncStorage.setItem('@lastPush', new Date().getTime().toString())
    } catch (e) {
      console.error(e)
    }
  }

  const getLocalPush = async () => {
    try {
      const value = await AsyncStorage.getItem('@push')
      if (value !== null) {
        return value
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getLastPush = async () => {
    try {
      const value = await AsyncStorage.getItem('@lastPush')
      if (value !== null) {
        return value
      }
    } catch (e) {
      console.error(e)
    }
  }

  const registerAppTracking = async () => {
    const { status } = await requestTrackingPermissionsAsync();
    if (status === 'granted') {
      setTracking(true)
    }
  };


  // PUSH
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
        setExpoPushToken(token);
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  // store push
  const storePush = async () => {
    const local = await getLocalPush()
    const last = await getLastPush()
    console.log({ expoPushToken, last, local })
    if (expoPushToken?.data && (!last || !local || local !== expoPushToken?.data)) {
      console.log("REQUEST")
      const url = `https://www.dreampip.com/api/store_push?data=${expoPushToken?.data}&project=purizu&locale=${deviceLanguage}`
      const res1 = await (await fetch(url)).json();
      console.log({ res1 })
      const ok = Boolean(res1?.ok)
      if (ok) await storeLocalPush(expoPushToken?.data)
    }
  }

  //open site
  const openSite = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url
      const expiry = response.notification.request.content.data.expiry
      const expiryUrl = response.notification.request.content.data.expiryUrl
      if (!url && !expiry) return

      if (!!url) {
        try {
          openSite(url)
        } catch (e) {
          console.error(e)
        }
      }

      if (!!expiry) {
        const now = new Date().getTime()
        if (now - Number(expiry) > 0) {
          try {
            openSite(expiryUrl)
          } catch (e) {
            console.error(e)
          }
        }
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  useActive(registerAppTracking, [])

  useEffect(() => {
    if (expoPushToken) {
      storePush()
    }
  }, [expoPushToken])

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Provider store={store}>
          <Tab.Navigator tabBar={props => <MyTabBar {...props} />} screenOptions={{
            header: ({ navigation, route, options }) => {
              const title = getHeaderTitle(options, route.name);
              return <Header message={title} />;
            }
          }}>
            <Tab.Screen key="player" name={localization['player']} component={Player} />
            <Tab.Screen key="chat" name={localization['chat']} component={() => <Website locale={locale} tracking={tracking} path="chat" />} />
            <Tab.Screen key="episodes" name={localization['episodes']} component={() => <Website locale={locale} tracking={tracking} path="episodes" />} />
            <Tab.Screen key="shows" name={localization['shows']} component={() => <Website locale={locale} tracking={tracking} path="shows" />} />
            <Tab.Screen key="events" name={localization['events']} component={() => <Website locale={locale} tracking={tracking} path="events" />} />
            <Tab.Screen key="blog" name={localization['blog']} component={() => <Website locale={locale} tracking={tracking} path="blog" />} />
          </Tab.Navigator>
        </Provider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

