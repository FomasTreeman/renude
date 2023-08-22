import { useState, useContext } from 'react';
import { TextInput, SafeAreaView, View, StyleProp, TextStyle } from 'react-native';
import Continue from '../components/Continue';
import { useSignIn } from '@clerk/clerk-expo';
import Button from '../components/Button';
import Text from '../components/Text';
import { ThemeContext } from '../context/ThemeContext';

export default function Login({ navigation }: any) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const theme = useContext(ThemeContext)
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      console.log(JSON.stringify(completeSignIn, null, 2))
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      navigation.navigate('Home');
    } catch (err: any) {
      console.log('error')
      console.log({ err });
    }
  };
  return (
    <SafeAreaView className='mx-8 my-5'>
      <View className="ml-auto">
        <Button
          text="sign up"
          cb={() => navigation.navigate('SignUp')}
          colour='orange'
        />
      </View>

      <Text text='Hello again,' tag='h1' />
      <Text text='Welcome back' tag='h3' tw='mb-5' />
      <View className='flex flex-col gap-5 my-3'>

        <TextInput
          style={theme.textInput}
          autoCapitalize='none'
          value={emailAddress}
          placeholder='Email'
          keyboardType='email-address'
          textContentType='emailAddress'
          onChangeText={(email: string) => setEmailAddress(email)}
        />

        <TextInput
          style={theme.textInput}
          autoCapitalize='none'
          value={password}
          placeholder='Password'
          secureTextEntry
          textContentType='password'
          onChangeText={(password: string) => setPassword(password)}
        />
      </View>

      <View className='mx-auto my-10'>
        <Continue cb={onSignInPress} />
      </View>
    </SafeAreaView >
  );
}
