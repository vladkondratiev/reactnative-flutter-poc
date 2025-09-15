/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export const ReactNativeIntro = () => {
  return (
    <SafeAreaProvider>
      <ReactNativeIntroContent />
    </SafeAreaProvider>
  );
};

export const ReactNativeIntroContent = () => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName='react-native-intro.tsx'
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
