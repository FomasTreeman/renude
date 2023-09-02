import { SafeAreaView, View, Pressable, FlatList, ScrollView } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Text from '../components/Text';
import Listing from '../components/Listing';
import { trpc } from '../utils/trpc';

const Listings = () => {
  const theme = useContext(ThemeContext)
  const listingsQuery = trpc.usersListings.useQuery()
  // const { isSignedIn, user, isLoaded } = useUser();

  // console.log('👩‍💻', user?.username);
  // useEffect(() => {
  //   async function fetchListings() {
  //     const data = await trpc.allListings.useQuery()
  //     if (data) {
  //       console.log(data[0])
  //     }
  //   }
  //   fetchListings()
  // })

  // const listings = trpc.allListings.useQuery()

  return (
    <SafeAreaView>
      <ScrollView>

        <Text tag='h1' textStyle='mx-auto my-3'> Hello 😀 </Text>
        <View>
          <Text tag='h3' textStyle='mt-5' > Suggestions </Text>
          <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} />}
            keyExtractor={item => `ListEntry-${item.createdAt}`}
            horizontal
          />
        </View>
        <View>
          <Text tag='h3' textStyle='mt-5' > Favourites </Text>
          <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} />}
            keyExtractor={item => `ListEntry-${item.createdAt}`}
            horizontal
          />
        </View>
        <Text tag='h3' textStyle='mt-5' > Follower Posts </Text>
        <View>
          <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} />}
            keyExtractor={item => `ListEntry-${item.createdAt}`}
            horizontal
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Listings;

