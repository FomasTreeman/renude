import { SafeAreaView, View } from "react-native";
import { useUser } from '@clerk/clerk-expo';

import { trpc } from "../utils/trpc";

import ListingComponent from "../components/Listing";
import Back from "../components/Back";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import CheckoutButton from "../components/CheckoutButton";

interface IListingProps {
    route: {
        params: {
            listing?: any, //find type
            previousScreen?: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any,
    },
    [key: string]: any,

}


export default function Listing({ route: { params } }: IListingProps) {
    const [offer, setOffer] = useState(null)

    const { user } = useUser()

    const createOffer = trpc.createOffer.useMutation()

    const email = user?.primaryEmailAddress?.emailAddress as string //is alway going to be signed in

    return (
        <SafeAreaView>
            <Back navigateTo={params?.previousScreen || ''} />
            <View className="flex items-center justify-center">
                <ListingComponent listing={params?.listing} />
                <Input
                    placeholder="offer price"
                    containerStyle={{ width: '50%', marginTop: 30, marginBottom: 15 }}
                    value={offer}
                    cb={(value) => setOffer(value)}
                />
                {offer ?
                    <Button
                        colour="orange"
                        text={`Make offer @ ${offer}`}
                        cb={() => {
                            createOffer.mutate({ email, offer: parseFloat(offer), listingId: params?.listing.id })
                        }}
                    />
                    : null
                }

                <CheckoutButton email={email} listingId={params?.listing.id} amount={params?.listing.price} />
                {/* <Button colour="green" cb={() => createOrder.mutate({ email, listingId: params?.listing.id })} text='Buy now' /> */}
            </View>
        </SafeAreaView>
    )
}