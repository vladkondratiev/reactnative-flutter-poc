// @flow
import { NativeEventEmitter, NativeModules } from 'react-native';

const { AuthCodeEmitter } = NativeModules;

export default AuthCodeEmitter ? new NativeEventEmitter(AuthCodeEmitter) : null;