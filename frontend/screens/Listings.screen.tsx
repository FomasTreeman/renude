import { SafeAreaView, View, Pressable, FlatList, ScrollView } from 'react-native';
import Text from '../components/Text';
import Listing from '../components/Listing';
import { trpc } from '../utils/trpc';

const Listings = () => {
  const suggestionsListingsQuery = trpc.usersListings.useQuery('user1@example.com')
  const favouritesListingsQuery = trpc.usersListings.useQuery('user2@example.com')
  const followersListingsQuery = trpc.usersListings.useQuery('user3@example.com')

  return (
    <SafeAreaView>
      <ScrollView>

        <Text tag='h1' textStyle='mx-auto my-3'>renude</Text>
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
            data={suggestionsListingsQuery.data}
            renderItem={({ item }) => <Listing listing={item} previousScreen='Listings' />}
            keyExtractor={(item, index) => `SuggestionsListEntry-${index}-${item.createdAt}`}
            horizontal
          />
        </View>
        <View>
          <Text tag='h3' textStyle='mt-5' > Favourites </Text>
          <FlatList
            data={favouritesListingsQuery.data}
            renderItem={({ item }) => <Listing listing={item} previousScreen='Listings' />}
            keyExtractor={(item, index) => `FavouritesListEntry-${index}-${item.createdAt}`}
            horizontal
          />
        </View>
        <Text tag='h3' textStyle='mt-5' > Follower Posts </Text>
        <View>
          <FlatList
            data={followersListingsQuery.data}
            renderItem={({ item }) => <Listing listing={item} previousScreen='Listings' />}
            keyExtractor={(item, index) => `FollowersListEntry-${index}-${item.createdAt}`}
            horizontal
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Listings;

