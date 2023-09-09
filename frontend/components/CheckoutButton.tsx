import { useStripe } from '@stripe/stripe-react-native';

import { trpc } from '../utils/trpc';

import Button from './Button';
import { Alert } from 'react-native';

export default function Checkout({ email, listingId, amount }: { email: string, listingId: number, amount: number }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const createOrder = trpc.createOrder.useMutation()
    const { data, error, refetch: createPaymentIntent } = trpc.createIntent.useQuery(amount, { enabled: false })

    const initializePaymentSheet = async (secret: string) => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "renude",
            paymentIntentClientSecret: secret,
        });
        if (!error) {
            // handle error
        }
    };

    const showPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert('Error code:', error.code)
        } else {
            // Payment completed - show a confirmation screen.
            createOrder.mutate({ email, listingId: listingId })
        }
    }

    const didTapCheckoutButton = async () => {

        // 1. 
        await createPaymentIntent()

        if (!data?.secret || error) return

        // 2. 
        initializePaymentSheet(data?.secret)

        // 3.
        showPaymentSheet()

    }

    return (
        <Button colour="green" cb={didTapCheckoutButton} text='Buy now' />
    )

}
