import { Text, View, Image } from 'react-native';
import { SignedOut, useUser, SignedIn, useAuth } from '@clerk/clerk-expo';
import { Button } from '@rneui/themed';

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { isSignedIn, user, isLoaded } = useUser();

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
        <SignOut />
      </SignedIn>
      <SignedOut>
        <Text className="m-5 bg-red-200 p-5 text-xl text-center">
          Not signed in
        </Text>
        <View>
          <Image
            className="h-28 w-48 m-auto"
            source={{
              uri: 'https://media4.giphy.com/media/5e22CwMaD4oMSk3Qpc/200.gif',
            }}
          ></Image>
        </View>
        <View className="m-auto my-5">
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            buttonStyle={{ borderRadius: 30, maxWidth: 100 }}
          />
        </View>
        <View className="m-auto">
          <Button
            title="login"
            onPress={() => navigation.navigate('Login')}
            color={'green'}
            buttonStyle={{ borderRadius: 30, maxWidth: 100 }}
          />
        </View>
      </SignedOut>
    </View>
  );
};

export default HomeScreen;
