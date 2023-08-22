// @ts-ignore
import { CLERK_PUBLISHABLE_KEY } from '@env';
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { ThemeContext } from './context/ThemeContext';
import { theme } from './theme'
import { useFonts } from 'expo-font';
import TabNavigator from './components/Tabs';
import AuthNavigator from './components/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';

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
  const [loaded] = useFonts({
    Syne: require('./assets/fonts/Syne/Syne-VariableFont_wght.ttf'),
    Inter: require('./assets/fonts/Inter/Inter-VariableFont.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={CLERK_PUBLISHABLE_KEY}
      >
        <NavigationContainer>
          {/* <SignedIn> */}
          <TabNavigator />
          {/* </SignedIn> */}
          {/* <SignedOut>
            <AuthNavigator />
          </SignedOut> */}
        </NavigationContainer>
      </ClerkProvider>
    </ThemeContext.Provider>
  );
};

export default App;
