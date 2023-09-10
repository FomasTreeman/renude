import { useStripe } from '@stripe/stripe-react-native';

import { trpc } from '../utils/trpc';

import Button from './Button';
import { Alert } from 'react-native';

export default function Checkout({ email, listingId, amount }: { email: string, listingId: number, amount: number }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const createOrder = trpc.createPurchase.useMutation()
    const { data, error, refetch: createPaymentIntent } = trpc.createIntent.useQuery(amount * 100, { enabled: false })

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

    // const waitOnPaymentIntentResolve = () => {
    // fetch('http://localhost:3001', {
    //     method: 'POST',
    //     headers: {

    //     }
    // })
    // }

    const didTapCheckoutButton = async () => {

        // 1. 
        await createPaymentIntent()
        if (!data?.secret || error) return

        // 2. 
        initializePaymentSheet(data?.secret)

        // 3.
        showPaymentSheet()

        // waitOnPaymentIntentResolve()

    }

    return (
        <Button colour="green" cb={didTapCheckoutButton} text='Buy now' />
    )

}
