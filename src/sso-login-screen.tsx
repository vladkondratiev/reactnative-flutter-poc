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
  ScrollView,
  EventSubscription,
  NativeModules,
  NativeEventEmitter,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useTokenExchange } from './hooks/useTokenExchange';
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
  const { exchangeToken, isLoading, error, tokenData, reset } = useTokenExchange();

  const ssoUrl = 'https://smartcrowd-auth-demo.my.smartcrowd.ae/login?client_id=5m1plb2f985bq2ppu7n8dshhnd&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000';

  useEffect(() => {
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

  useEffect(() => {
    if (authCode && !showWebView) {
      console.log('useEffect calling exchangeToken with authCode:', authCode);
      exchangeToken(authCode);
    }
  }, [authCode, showWebView, exchangeToken]);

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
      console.log(' >>> code', code);

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
      <ScrollView bounces={false} contentContainerStyle={styles.scrollViewContainer}>
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

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2196f3" />
              <Text style={styles.loadingText}>Exchanging code for tokens...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorLabel}>Token Exchange Error:</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => authCode && exchangeToken(authCode)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {tokenData && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>✅ Token Exchange Successful!</Text>
              <Text style={styles.tokenText}>Access Token: {tokenData.access_token.substring(0, 20)}...</Text>
              <Text style={styles.tokenText}>Token Type: {tokenData.token_type}</Text>
              <Text style={styles.tokenText}>Expires In: {tokenData.expires_in} seconds</Text>
              {tokenData.id_token && (
                <Text style={styles.tokenText}>ID Token: {tokenData.id_token.substring(0, 20)}...</Text>
              )}
              {tokenData.refresh_token && (
                <Text style={styles.tokenText}>Refresh Token: {tokenData.refresh_token.substring(0, 20)}...</Text>
              )}
              {tokenData.scope && (
                <Text style={styles.tokenText}>Scope: {tokenData.scope}</Text>
              )}
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
        </View>
      </ScrollView>

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
  scrollViewContainer: {
    paddingVertical: 40,
  },
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  loadingText: {
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 8,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'monospace',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tokenContainer: {
    width: '100%',
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'monospace',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 4,
  },
});
