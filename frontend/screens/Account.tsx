import { View, SafeAreaView, FlatList } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-react';

import { trpc } from '../utils/trpc';

import Button from '../components/Button';
import Text from '../components/Text';
import Listing from '../components/Listing';
import { useEffect } from 'react';

export default function Account() {
    const { signOut } = useAuth();
    const { user } = useUser()


    if (!user) return null
    const listingsQuery = trpc.usersListings.useQuery(user.emailAddresses[0].emailAddress)

    return (
        <SafeAreaView className='mx-1'>
            <FlatList
                data={listingsQuery.data}
                renderItem={({ item }) => <Listing {...item} height={100} width={150} footerSize='lg' />}
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