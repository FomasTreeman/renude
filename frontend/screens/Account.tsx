import { View, SafeAreaView } from 'react-native';
import { useAuth } from '@clerk/clerk-react';
import Button from '../components/Button';

const SignOut = () => {
    const { signOut } = useAuth();

    return (
        <View>
            <Button
                colour='purple'
                text="Sign Out"
                cb={() => {
                    signOut();
                }}
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