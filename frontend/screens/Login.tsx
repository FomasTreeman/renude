import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Input, Card, Button } from '@rneui/themed';

export default function Login({ navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      navigation.navigate('Home');
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <Card>
      <Input
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(email: string) => setEmailAddress(email)}
      />
      <Input
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password: string) => setPassword(password)}
      />

      <Button onPress={onSignInPress}>Log In</Button>
    </Card>
  );
}
