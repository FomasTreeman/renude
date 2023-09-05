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

  return (
    <SafeAreaView>
      <ScrollView>

        <Text tag='h1' textStyle='mx-auto my-3'> Hello 😀 </Text>
        <View>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between'
          }}>
            <Text tag='h3'> Suggestions </Text>
            <Pressable>
              <Text tag='body' textStyle={{ textDecorationLine: 'underline', color: 'red' }}> See all </Text>
            </Pressable>
          </View>
          <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} />}
            keyExtractor={(item, index) => `SuggestionsListEntry-${index}-${item.createdAt}`}
            horizontal
          />
        </View>
        <View>
          <Text tag='h3' textStyle='mt-5' > Favourites </Text>
          <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} />}
            keyExtractor={(item, index) => `FavouritesListEntry-${index}-${item.createdAt}`}
            horizontal
          />
        </View>
        <Text tag='h3' textStyle='mt-5' > Follower Posts </Text>
        <View>
          <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} />}
            keyExtractor={(item, index) => `FollowersListEntry-${index}-${item.createdAt}`}
            horizontal
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Listings;

