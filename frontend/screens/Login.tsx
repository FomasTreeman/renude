import { useState, useContext } from 'react';
import { TextInput, SafeAreaView, View, StyleProp, TextStyle } from 'react-native';
import Continue from '../components/Continue';
import { useSignIn } from '@clerk/clerk-expo';
import Button from '../components/Button';
import Text from '../components/Text';
import { ThemeContext } from '../context/ThemeContext';
import Input from '../components/Input';

export default function Login({ navigation }: any) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const theme = useContext(ThemeContext)
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

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

      // insert email into db


      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log('error')
      console.log({ err });
      setIsError(true)
    }
  };
  return (
    <View style={{ backgroundColor: theme.colours.background, height: '100%' }}>
      <SafeAreaView className='my-5 mt-10'>

        <View className="ml-auto mr-2">
          <Button
            text="sign up"
            cb={() => navigation.navigate('SignUp')}
            colour='orange'
          />
        </View>

        <View className='mx-10'>

          <Text tag='h1' textStyle='my-2'>Hello again, </Text>
          <Text tag='h3' textStyle='mb-5'>  Welcome back </Text>

          <View className='flex flex-col gap-5 ml-0'>
            <Input
              placeholder='Email'
              value={emailAddress}
              keyboardType='email-address'
              textContentType='emailAddress'
              cb={(email: string) => {
                setEmailAddress(email)
                setIsError(false)
              }}
            />

            <Input
              placeholder='Password'
              state={password}
              secureTextEntry
              textContentType='password'
              cb={(password: string) => {
                setPassword(password)
                setIsError(false)
              }}
            />

          </View>

          <View className='mx-auto my-10'>
            <Continue cb={onSignInPress} isError={isError} />
          </View>

        </View>
      </SafeAreaView >
    </View>
  );
}
