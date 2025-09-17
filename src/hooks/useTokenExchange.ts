import { useState, useCallback, useRef } from 'react';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

interface TokenExchangeState {
  isLoading: boolean;
  error: string | null;
  tokenData: TokenResponse | null;
}

interface UseTokenExchangeReturn extends TokenExchangeState {
  exchangeToken: (authCode: string) => Promise<void>;
  reset: () => void;
}

export const useTokenExchange = (): UseTokenExchangeReturn => {
  const [state, setState] = useState<TokenExchangeState>({
    isLoading: false,
    error: null,
    tokenData: null,
  });

  // Track which auth codes have already been exchanged
  const exchangedCodes = useRef<Set<string>>(new Set());

  const exchangeToken = useCallback(async (authCode: string) => {
    console.log('exchangeToken called with authCode:', authCode);

    // Check if this auth code has already been exchanged
    if (exchangedCodes.current.has(authCode)) {
      console.log('Auth code already exchanged, skipping:', authCode);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    console.log('Exchanging token for auth code:', authCode);

    try {
      const response = await fetch('https://smartcrowd-auth-demo.my.smartcrowd.ae/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: '5m1plb2f985bq2ppu7n8dshhnd',
          redirect_uri: 'http://localhost:3000',
          code: authCode,
        }).toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const tokenData: TokenResponse = await response.json();

      console.log('Token exchange successful!');

      // Mark this auth code as exchanged
      exchangedCodes.current.add(authCode);

      setState(prev => ({
        ...prev,
        isLoading: false,
        tokenData,
        error: null,
      }));
    } catch (error) {
      console.log('Token exchange error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        tokenData: null,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      tokenData: null,
    });
    // Clear the exchanged codes when resetting
    exchangedCodes.current.clear();
  }, []);

  return {
    ...state,
    exchangeToken,
    reset,
  };
};
