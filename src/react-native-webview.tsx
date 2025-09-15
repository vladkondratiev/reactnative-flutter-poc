import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface ReactNativeWebViewProps {
  uri?: string;
}

export const ReactNativeWebView = ({
  uri = 'https://reactnative.dev',
}: ReactNativeWebViewProps) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
