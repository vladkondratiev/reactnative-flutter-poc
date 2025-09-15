declare module '@react-native/new-app-screen' {
  import { ReactNode } from 'react';

  export interface NewAppScreenProps {
    templateFileName?: string;
    safeAreaInsets?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  }

  export function NewAppScreen(props: NewAppScreenProps): ReactNode;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}
