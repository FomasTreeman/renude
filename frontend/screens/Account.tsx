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
    const listingsQuery = trpc.usersListings.useQuery({ email: user.emailAddresses[0].emailAddress })

    // console.log(user.emailAddresses[0].emailAddress)

    return (
        <FlatList
            data={listingsQuery.data}
            renderItem={({ item }) => <Listing {...item} height={100} width={160} footerSize='lg' />}
            numColumns={2}
            keyExtractor={item => `ListEntry-${item.createdAt}`}
            ListHeaderComponent={
                <>
                    <Text tag='h2' textStyle='m-2 mt-5'> {user?.username || 'USER'} </Text>
                    <Button
                        colour='purple'
                        text="Sign Out"
                        cb={signOut}
                    />
                </>
            }
        />
    );
};
export default function Account() {
    return (
        <SafeAreaView>
            <SignOut />
        </SafeAreaView>
    )
}