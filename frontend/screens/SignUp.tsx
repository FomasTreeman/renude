import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, TextInput, SafeAreaView, StyleProp, TextStyle } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Button from '../components/Button';
import Text from '../components/Text';
import Continue from '../components/Continue';

export default function SignUp({ navigation }: any) {
  const theme = useContext(ThemeContext)
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
    <>
      {!pendingVerification ? (
        <SafeAreaView className='mx-8 my-5'>
          <View className="ml-auto">
            <Button
              text="login"
              cb={() => navigation.navigate('Login')}
              colour='orange'
            />
          </View>
          <Text text='Hello,' tag='h1' />
          <Text text="Let's get you signed up" tag='h3' tw='mb-5' />

          <View className='flex flex-col gap-5 my-3'>

            <TextInput
              style={theme.textInput}
              autoCapitalize="none"
              value={emailAddress}
              placeholder='Email'
              keyboardType='email-address'
              textContentType='emailAddress'
              onChangeText={(email: string) => setEmailAddress(email)}
            />
            <TextInput
              style={theme.textInput}
              autoCapitalize="none"
              value={username}
              placeholder="Username..."
              onChangeText={(username: string) => setUsername(username)}
            />
            <TextInput
              style={theme.textInput}
              autoCapitalize="none"
              value={password}
              placeholder='Password'
              secureTextEntry
              textContentType='password'
              onChangeText={(password: string) => setPassword(password)}
            />
          </View>

          <View className='mx-auto my-10'>
            <Continue cb={onSignUpPress} />
          </View>
        </SafeAreaView >

      ) : (
        <View className="">
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code: string) => setCode(code)}
            />
          </View>
          <Button text='Verify Email' colour='purple' cb={onPressVerify} />
        </View>
      )
      }
    </>
  );
}

