import { Text, View, TextInput, SafeAreaView } from 'react-native';
import { SignedOut, useUser, SignedIn, useAuth } from '@clerk/clerk-expo';
import { useEffect, useContext } from 'react';
import Button from '../components/Button';
import Continue from '../components/Continue';
import { ThemeContext } from '../context/ThemeContext';

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  // if (!isLoaded) {
  //   return null;
  // }

  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
      { }
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const theme = useContext(ThemeContext)

  useEffect(() => { }, []);

  if (!isLoaded) {
    console.log('Loading...');
  } else {
    console.log('is signed in? ', isSignedIn);
  }

  console.log('👩‍💻', user?.username);

  return (
    <View>
      <SignedIn>
        <Text className="m-5 bg-red-200 p-5 text-xl text-center">
          Hello {user?.username}!
        </Text>
        <View className="m-auto">
          <Button
            text="upload"
            cb={() => navigation.navigate('Upload')}
            colour={'green'}
          />
        </View>
        <SignOut />
      </SignedIn>
      <SignedOut>
        <SafeAreaView className='mx-8 my-5'>
          <View className="ml-auto">
            <Button
              text="login"
              cb={() => navigation.navigate('Login')}
              colour='orange'
            />
          </View>

          <Text style={theme.textVariants.h1}>
            Hello,
          </Text>
          <Text style={theme.textVariants.h3} className='mb-5'>
            Let's get you signed up
          </Text>

          <View className='flex flex-col gap-5 my-3'>

            <TextInput
              style={theme.textInput}
              placeholder='Email'
              keyboardType='email-address'
              textContentType='emailAddress'
            />

            <TextInput
              style={theme.textInput}
              placeholder='Password'
              secureTextEntry
              textContentType='password'
            />
          </View>

          <View className='mx-auto my-10'>
            <Continue cb={() => { navigation.navigate('SignUp') }} />
          </View>
        </SafeAreaView>
      </SignedOut>
    </View>
  );
};

export default HomeScreen;

