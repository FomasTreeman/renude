import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import React, { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { httpBatchLink } from '@trpc/client';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

import { ThemeContext } from './context/ThemeContext';
import { theme } from './theme'

import { trpc } from './utils/trpc';

import TabNavigator from './components/Tabs';
import AuthNavigator from './components/AuthNavigator';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const App = () => {
  // const { handleURLCallback } = useStripe();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000',
        }),
      ],
    }),
  );

  const [loaded] = useFonts({
    Syne: require('./assets/fonts/Syne/Syne-VariableFont_wght.ttf'),
    Inter: require('./assets/fonts/Inter/Inter-VariableFont.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // const handleDeepLink = useCallback(
  //   async (url: string | null) => {
  //     if (url) {
  //       const stripeHandled = await handleURLCallback(url);
  //       if (stripeHandled) {
  //         // This was a Stripe URL - you can return or add extra handling here as you see fit
  //       } else {
  //         // This was NOT a Stripe URL – handle as you normally would
  //       }
  //     }
  //   },
  //   [handleURLCallback]
  // );

  // useEffect(() => {
  //   const getUrlAsync = async () => {
  //     const initialUrl = await Linking.getInitialURL();
  //     handleDeepLink(initialUrl);
  //   };

  //   getUrlAsync();

  //   const deepLinkListener = Linking.addEventListener(
  //     'url',
  //     (event: { url: string }) => {
  //       handleDeepLink(event.url);
  //     }
  //   );

  //   return () => deepLinkListener.remove();
  // }, [handleDeepLink]);


  return (
    <ThemeContext.Provider value={theme}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
        tokenCache={tokenCache}
      >
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_TEST_STRIPE_KEY as string}
          urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <NavigationContainer>
                <SignedIn>
                  <TabNavigator />
                </SignedIn>
                <SignedOut>
                  <AuthNavigator />
                </SignedOut>
              </NavigationContainer>
            </QueryClientProvider>
          </trpc.Provider>
        </StripeProvider>
      </ClerkProvider>
    </ThemeContext.Provider >
  );
};

export default App;
