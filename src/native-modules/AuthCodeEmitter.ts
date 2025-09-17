import type { TurboModule, CodegenTypes } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type AuthCodeData = {
  authCode: string,
}

export interface Spec extends TurboModule {
  readonly onAuthCodeReceived: CodegenTypes.EventEmitter<AuthCodeData>;
  emitAuthCode(authCode: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'AuthCodeEmitter',
);
