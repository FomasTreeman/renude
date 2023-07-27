import * as React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Input, Card, Button } from '@rneui/themed';

export default function SignUp({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // start the sign up process.
  const onSignUpPress = async () => {
    console.log('🔥 sign up pressed and isLoaded: ', isLoaded);
    if (!isLoaded) return;

    try {
      const createResult = await signUp.create({
        emailAddress,
        username,
        password,
      });

      console.log({ createResult });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      console.log(completeSignUp);
      await setActive({ session: completeSignUp.createdSessionId });
      navigation.navigate('Home');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Card>
      {!pendingVerification ? (
        <View>
          <Input
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email: string) => setEmailAddress(email)}
          />
          <Input
            autoCapitalize="none"
            value={username}
            placeholder="Username..."
            onChangeText={(username: string) => setUsername(username)}
          />
          <Input
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password: string) => setPassword(password)}
          />

          <Button onPress={onSignUpPress}>Sign up</Button>
        </View>
      ) : (
        <View className="">
          <View>
            <Input
              value={code}
              placeholder="Code..."
              onChangeText={(code: string) => setCode(code)}
            />
          </View>
          <Button onPress={onPressVerify}>Verify Email</Button>
        </View>
      )}
    </Card>
  );
}
