// @ts-ignore
import { CLERK_PUBLISHABLE_KEY } from '@env';
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

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
  return (
    <NavigationContainer>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={CLERK_PUBLISHABLE_KEY}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Sign up' }}
          />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </ClerkProvider>
    </NavigationContainer>
  );
};

export default App;
