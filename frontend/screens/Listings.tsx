import { SafeAreaView, View, Pressable, FlatList } from 'react-native';
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


  console.log(listingsQuery.data[0]);

  return (
    <SafeAreaView>
      <Text tag='h1' textStyle='mx-auto my-3'> Hello 😀 </Text>
      <Text tag='h3' textStyle='mt-5' > Suggestions </Text>
      <FlatList
        data={listingsQuery.data}
        renderItem={({ item }) => <Listing {...item} />}
        keyExtractor={item => `ListEntry-${item.createdAt}`}
        horizontal
        style={{ height: 225 }}
      />
    </SafeAreaView>
  );
};

export default Listings;

