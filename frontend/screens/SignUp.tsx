import { useState, useContext } from 'react';
import { View, TextInput, SafeAreaView } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';

import { ThemeContext } from '../context/ThemeContext';
import { trpc } from '../utils/trpc';

import Button from '../components/Button';
import Text from '../components/Text';
import Input from '../components/Input';
import InputError from '../components/InputError';
import Continue from '../components/Continue';

export default function SignUp({ navigation }: any) {
  const theme = useContext(ThemeContext)
  const { isLoaded, signUp, setActive } = useSignUp();
  const createUser = trpc.createUser.useMutation()

  const [emailAddress, setEmailAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState<null | boolean>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors]: [error: Partial<{ [Key in 'email_address' | "username" | "password"]: string }>, setError: any] = useState({} as any);

  // start the sign up process.
  const onSignUpPress = async () => {
    console.log('🔥 sign up pressed and isLoaded: ', isLoaded);
    if (!isLoaded || !isPasswordValid || !password || !emailAddress) return;
    // if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        username,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
      setErrors([])
    } catch (err: any) {
      const updatedErrors = errors
      err.errors.forEach((err: any) => updatedErrors[err.meta.paramName as keyof typeof errors] = err.longMessage);
      setErrors({ ...updatedErrors });
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      createUser.mutate({ email: emailAddress })
      await setActive({ session: completeSignUp.createdSessionId });
      navigation.navigate('Home');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      {!pendingVerification ? (
        <View style={{ backgroundColor: theme.colours.background, height: '100%' }}>
          <SafeAreaView className='my-5 mt-10'>
            <View className="ml-auto mr-2">
              <Button
                text="login"
                cb={() => navigation.navigate('Login')}
                colour='orange'
              />
            </View>
            <View className='mx-10'>
              <Text tag='h1' textStyle='my-2' >Hello, </Text>
              <Text tag='h3' > Let's get you signed up </Text>

              <View style={{ display: 'flex', gap: 30, marginVertical: 60 }}>
                <InputError
                  placeholder='Email'
                  type='email_address'
                  value={emailAddress}
                  setState={setEmailAddress}
                  errors={errors}
                  setErrors={setErrors}
                />
                <InputError
                  placeholder='Username'
                  type='username'
                  value={username}
                  setState={setUsername}
                  errors={errors}
                  setErrors={setErrors}
                />
                <InputError
                  placeholder='Password'
                  type='password'
                  value={password}
                  setState={setPassword}
                  errors={errors}
                  setErrors={setErrors}
                />
                <Input
                  placeholder='Re-enter Password'
                  style={{ borderColor: isPasswordValid === false ? 'red' : 'black' }}
                  secureTextEntry
                  textContentType='password'
                  cb={(passwordToCompare: string) => passwordToCompare === password ? setIsPasswordValid(true) : setIsPasswordValid(false)}
                >
                  <View style={{ position: 'absolute', zIndex: 3, bottom: -22, left: 10 }}>
                    {isPasswordValid === false && <Text tag='error' textStyle='mt-2' style={{ color: 'red' }}> Doesn't match</Text>}
                  </View>
                </Input>
              </View>
            </View>

            <View className='mx-auto'>
              <Continue cb={onSignUpPress} />
            </View>
          </SafeAreaView >
        </View>

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

