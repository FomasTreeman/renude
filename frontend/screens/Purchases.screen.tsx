import { SafeAreaView, View, FlatList } from 'react-native';
import { useUser } from '@clerk/clerk-react';

import { trpc } from '../utils/trpc';

import Text from '../components/Text';
import Back from '../components/Back';
import Listing from '../components/Listing';


export default function Account() {
    const { user } = useUser()

    if (!user) return null
    const email = user.emailAddresses[0].emailAddress
    const allPurchases = trpc.allPurchases.useQuery(email)

    return (
        <SafeAreaView className='mx-3 mt-5'>
            {allPurchases.data?.length !== 0 ?
                <FlatList
                    data={allPurchases.data}
                    renderItem={({ item }) => <Listing {...item} />}
                    keyExtractor={(_, index) => `ListEntry-${index}`}
                    ListHeaderComponent={
                        <View className='flex flex-row items-center justify-between'>
                            <Back navigateTo='Account' />
                            <Text tag='h1' className='mr-4'>Purchases</Text>
                        </View>
                    }
                /> :
                <Text tag='h1' style={{ paddingTop: 50 }}>You have not bought anything yet 🛒</Text>
            }
        </SafeAreaView>
    )
}

