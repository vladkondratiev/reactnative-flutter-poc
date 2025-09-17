/**
 * SSO Login Screen - React Native version
 * Matches the Flutter SSO login screen design and functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  EventSubscription,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
const { AuthCodeEmitter: AuthCodeEmitterModule } = NativeModules;

export const SSOLoginScreen = () => {
  return (
    <SafeAreaProvider>
      <SSOLoginScreenContent />
    </SafeAreaProvider>
  );
};

const SSOLoginScreenContent = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const eventSubscription = useRef<EventSubscription | null>(null);

  const ssoUrl = 'https://smartcrowd-auth-demo.my.smartcrowd.ae/login?client_id=5m1plb2f985bq2ppu7n8dshhnd&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000';

  useEffect(() => {
    // Set up event listener for auth code events
    if (AuthCodeEmitterModule) {
      const eventEmitter = new NativeEventEmitter(AuthCodeEmitterModule);
      eventSubscription.current = eventEmitter.addListener('onAuthCodeReceived', (data: any) => {
        console.log('Auth code received in React Native:', data.authCode);
        setAuthCode(data.authCode);
      });
    }

    return () => {
      eventSubscription.current?.remove();
      eventSubscription.current = null;
    };
  }, []);

  const onSSOButtonPressed = () => {
    setShowWebView(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // Check if the URL contains the authorization code
    if (url.includes('?code=')) {
      const codeMatch = url.match(/[?&]code=([^&]*)/);
      const code = codeMatch ? codeMatch[1] : null;

      if (code) {
        console.log('Authorization code received:', code);
        setAuthCode(code);
        setShowWebView(false);

        // Emit the auth code event to Flutter
        if (AuthCodeEmitterModule) {
          AuthCodeEmitterModule.emitAuthCode(code);
        }
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔐</Text>
        </View>

        <Text style={styles.title}>Single Sign-On</Text>

        <Text style={styles.subtitle}>
          Sign in with your corporate credentials
        </Text>

        {authCode && (
          <View style={styles.authCodeContainer}>
            <Text style={styles.authCodeLabel}>Authorization Code:</Text>
            <Text style={styles.authCodeText}>{authCode}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={onSSOButtonPressed}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonIcon}>🔐</Text>
          <Text style={styles.loginButtonText}>Login with SSO</Text>
        </TouchableOpacity>

        {/* Temporary debug button */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: '#4caf50', marginTop: 12 }]}
          onPress={() => {
            console.log('Debug: invoking emitAuthCode with TEST_CODE_123');
            if (AuthCodeEmitterModule) {
              AuthCodeEmitterModule.emitAuthCode('TEST_CODE_123');
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonIcon}>🧪</Text>
          <Text style={styles.loginButtonText}>Send Test Code</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeWebView}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>SSO Login</Text>
        </View>
        <WebView
          bounces={false}
          source={{ uri: ssoUrl }}
          style={styles.webView}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsBackForwardNavigationGestures={true}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
    color: '#2196f3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#2196f3',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonIcon: {
    fontSize: 24,
    color: '#ffffff',
    marginRight: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  authCodeContainer: {
    width: '100%',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  authCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  authCodeText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'monospace',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});
