import { Text, View, TextInput, SafeAreaView } from 'react-native';
import { SignedOut, useUser, SignedIn, useAuth } from '@clerk/clerk-expo';
import { useEffect, useContext } from 'react';
import Button from '../components/Button';
import { ThemeContext } from '../context/ThemeContext';



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
    </View>
  );
};

export default HomeScreen;

