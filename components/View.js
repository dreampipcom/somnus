import { useEffect, useState } from "react"
import { Linking, Platform, ScrollView, Dimensions, Image, View as RNView } from "react-native"
import WebView from "react-native-webview"
import { refreshView } from '../redux/PlayerActions';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    refresh: state.refresh
  };
};


const connector = connect(mapStateToProps, null);

const View = (props) => {
  const refresh = props.refresh[props.path].date
  const [loaded, setLoaded] = useState(false)
  const { width, height } = Dimensions.get('window');
  const imageSize = width - 48;

  useEffect(() =>{

  }, [refresh])

  return <RNView style={{ flex: 1, height: null, width: null}}>
    <WebView
      key={refresh}
      scrollEnabled={props.disableScroll}
      style={{ minHeight: loaded ? 500 : 0 }}
      scalesPageToFit={true}
      bounces={false}
      javaScriptEnabled
      allowsInlineMediaPlayback
      source={{ uri: `http://www.dreampip.com/${props.locale || "en"}/${props.path}?mobileApp=true&tracking=${props.tracking}${Platform.OS === "ios" ? '&nextImage=true' : ''}` }}
      automaticallyAdjustContentInsets={false}
      mixedContentMode="compatibility"
      originWhitelist={['*']}
      domStorageEnabled
      allowUniversalAccessFromFileURLs
      allowFileAccessFromFileURLs
      ignoreSslError
      setSupportMultipleWindows={false}
      onShouldStartLoadWithRequest={event => {
        setLoaded(false)
        if (event.url.includes("discord") || event.url.includes("sympla")) {
          Linking.openURL(event.url)
          return false
        }
        return true
      }}
      onLoadEnd={() => {
        setTimeout(() => setLoaded(true), 500)
      }}
    />
    {!loaded ? (
      <RNView
        style={{ flex: 1, position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, width: "100%", backgroundColor: '#1f1f1f' }}
      >
        <RNView style={{ position: 'relative', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../img/logo-hor-white.png')} resizeMethod="cover" style={{ width: 300, height: 300, alignSelf: 'center' }} />
        </RNView>
      </RNView>) : undefined}
  </RNView>

}

export default connector(View)