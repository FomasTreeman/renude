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
    } catch (err: any) {
      console.log('error')
      console.log({ err });
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

          <View className='flex flex-col gap-5 my-3'>

            <View style={{ position: 'relative' }}>
              <View style={[theme.textInputLabel, { position: 'absolute' }]} >
                <Text tag='body'>Email</Text>
              </View>
              <TextInput
                style={theme.textInput}
                autoCapitalize='none'
                value={emailAddress}
                keyboardType='email-address'
                textContentType='emailAddress'
                onChangeText={(email: string) => setEmailAddress(email)}
              />
            </View>

            <View style={{ position: 'relative' }}>
              <View style={[theme.textInputLabel, { position: 'absolute' }]} >
                <Text tag='body'>Password</Text>
              </View>
              <TextInput
                style={theme.textInput}
                autoCapitalize='none'
                value={password}
                secureTextEntry
                textContentType='password'
                onChangeText={(password: string) => setPassword(password)}
              />
            </View>
          </View>

          <View className='mx-auto my-10'>
            <Continue cb={onSignInPress} />
          </View>

        </View>
      </SafeAreaView >
    </View>
  );
}
