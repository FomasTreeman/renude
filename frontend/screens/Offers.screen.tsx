import { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';
import { useUser } from '@clerk/clerk-react';

import { trpc } from '../utils/trpc';

import Button from '../components/Button';
import Text from '../components/Text';
import Back from '../components/Back';


export default function Account() {
    const { user } = useUser()

    if (!user) return null
    const email = user.emailAddresses[0].emailAddress
    const offers = trpc.allOffers.useQuery(email)

    function Offer({ listing, user: { email: listingOwner }, price, accepted: initialAccepted, id: offerId }: any) {
        const [accepted, setAccepted] = useState(initialAccepted)
        const acceptOffer = trpc.acceptOffer.useMutation()

        useEffect(() => {
            accepted === null || accepted === undefined || acceptOffer.mutate({ offerId, accepted })
        }, [accepted])

        return (
            <View className='my-4 pb-4 border-b-2'>
                <Text tag='h3'>{listing.description as string}</Text>
                <Text tag='h4'>Original = £{String(listing.price)}</Text>
                {listingOwner === email ?
                    accepted === undefined || accepted === null ?
                        <View className='flex flex-row justify-center items-center py-2'>
                            <Text tag='h2'>£{price}</Text>
                            <Button colour={'orange'} text={`Accept`} cb={() => setAccepted(true)} />
                            <Button colour={'green'} text={`Decline`} cb={() => setAccepted(false)} />
                        </View>
                        : accepted ? <Button colour='yellow' text='pending payment' cb={() => { }} />
                            : <Button colour='purple' text='declined offer' cb={() => { }} />
                    :
                    accepted === undefined || accepted === null ? <Button colour='yellow' text='pending offer request' cb={() => { }} /> :
                        accepted ? <Button colour='green' text='Pay now' cb={() => { }} />
                            : <Button colour='purple' text='Declined request' cb={() => { }} />
                }
            </View>
        )
    }

    return (
        <SafeAreaView className='mx-3 mt-5'>
            {offers.data?.length !== 0 ?
                <FlatList
                    data={offers.data}
                    renderItem={({ item }) => <Offer {...item} />}
                    keyExtractor={(_, index) => `ListEntry-${index}`}
                    ListHeaderComponent={
                        <View className='flex flex-row items-center justify-between'>
                            <Back navigateTo='Account' />
                            <Text tag='h1' className='mr-4'>Offers</Text>
                        </View>
                    }
                /> :
                <Text tag='h1' style={{ paddingTop: 50 }}>You have no offers 🛒</Text>
            }
        </SafeAreaView>
    )
}
33333
