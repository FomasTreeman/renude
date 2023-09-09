import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from "../screens/Login.screen"
import SignUp from "../screens/SignUp.screen"

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}