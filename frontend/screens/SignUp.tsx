import { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Input, Card, Button } from '@rneui/themed';

export default function SignUp({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError]: [error: Array<'email_address' | "username" | "password">, setError: any] = useState([]);

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

      // console.log({ createResult });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
      setError([])
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const errors = err.errors.map((err: any) => err.meta.paramName);
      console.log(errors)
      setError([...error.concat(errors)]);
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

  console.log(error)
  return (
    <Card>
      {!pendingVerification ? (
        <View>
          <Input
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            errorMessage={error.includes('email_address') ? 'Invalid' : ''}
            onChangeText={(email: string) => setEmailAddress(email)}
          />
          <Input
            autoCapitalize="none"
            value={username}
            placeholder="Username..."
            errorMessage={error.includes('username') ? 'Invalid' : ''}
            onChangeText={(username: string) => setUsername(username)}
          />
          <Input
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            errorMessage={error.includes('password') ? 'Invalid' : ''}
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

