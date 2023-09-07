import { View, SafeAreaView, FlatList } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-react';

import { trpc } from '../utils/trpc';

import Button from '../components/Button';
import Text from '../components/Text';
import Listing from '../components/Listing';


export default function Account() {
    const { signOut } = useAuth();
    const { user } = useUser()

    if (!user) return null
    // user.emailAddresses[0].emailAddress
    const listingsQuery = trpc.usersListings.useQuery(16)

    return (
        <SafeAreaView className='mx-1'>
            <FlatList
                data={listingsQuery.data}
                renderItem={({ item }) => <Listing listing={item} previousScreen='Account' height={100} width={150} footerSize='lg' />}
                numColumns={2}
                keyExtractor={(item, index) => `ListEntry-${index}-${item.createdAt}`}
                ListHeaderComponent={
                    <View className='mr-4'>
                        <Text tag='h2' textStyle='m-2'> {user?.username || 'USER'} </Text>
                        <Button
                            colour='purple'
                            text="Sign Out"
                            cb={signOut}
                        />
                    </View>
                }
            />
        </SafeAreaView>
    )
}