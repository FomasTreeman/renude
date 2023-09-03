import { View, SafeAreaView, FlatList } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-react';

import { trpc } from '../utils/trpc';

import Button from '../components/Button';
import Text from '../components/Text';
import Listing from '../components/Listing';

const SignOut = () => {
    const { signOut } = useAuth();
    const { user } = useUser()

    if (!user) return null
    const listingsQuery = trpc.usersListings.useQuery(user.emailAddresses[0].emailAddress)

    // console.log(user.emailAddresses[0].emailAddress)

    return (
        <View className='mx-1'>
            <FlatList
                data={listingsQuery.data}
                renderItem={({ item }) => <Listing {...item} height={100} width={150} footerSize='lg' />}
                numColumns={2}
                keyExtractor={item => `ListEntry-${item.createdAt}`}
                ListHeaderComponent={
                    <View className='mr-4'>
                        <Text tag='h2' textStyle='m-2 mt-5'> {user?.username || 'USER'} </Text>
                        <Button
                            colour='purple'
                            text="Sign Out"
                            cb={signOut}
                        />
                    </View>
                }
            />
        </View>
    );
};
export default function Account() {
    return (
        <SafeAreaView>
            <SignOut />
        </SafeAreaView>
    )
}