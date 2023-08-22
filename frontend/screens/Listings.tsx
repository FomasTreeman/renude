import { SafeAreaView, View, Pressable, FlatList } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Text from '../components/Text';
import Listing from '../components/Listing';



const HomeScreen = ({ navigation }: any) => {
  // const { isSignedIn, user, isLoaded } = useUser();
  const theme = useContext(ThemeContext)

  // console.log('👩‍💻', user?.username);

  return (
    <SafeAreaView>
      <Text text='Hello 😀' tag='h1' tw='mx-auto my-3' />
      <Text text='Suggestions' tag='h2' tw='mt-5' />
      <FlatList data={
        ['Jackson',
          'James',
          'Jillian',
          'Jimmy',
          'Joel',
          'John',
          'Julie',
        ]}
        renderItem={({ item }) => <Listing text={item} />}
        keyExtractor={item => `ListEntry-${item}`}
        horizontal
        style={{ height: 225 }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

