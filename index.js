import { AppRegistry } from 'react-native';

import { Counter } from './src/counter';
import { Hello } from './src/hello';
import { ReactNativeIntro } from './src/react-native-intro';
import { ReactNativeWebView } from './src/react-native-webview';
import { ReactNavigationFlow } from './src/react-navigation-flow';
import { SSOLoginScreen } from './src/sso-login-screen';

AppRegistry.registerComponent('Hello', () => Hello);
AppRegistry.registerComponent('Counter', () => Counter);
AppRegistry.registerComponent('ReactNativeIntro', () => ReactNativeIntro);
AppRegistry.registerComponent('ReactNativeWebView', () => ReactNativeWebView);
AppRegistry.registerComponent('ReactNavigationFlow', () => ReactNavigationFlow);
AppRegistry.registerComponent('SSOLoginScreen', () => SSOLoginScreen);
