import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Upload from '../screens/Upload';
import Listings from '../screens/Listings';

const Tab = createBottomTabNavigator()

export default function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Listings" component={Listings} />
            <Tab.Screen
                name="Upload"
                component={Upload}
                options={{ title: 'Upload listing' }}
            />
            {/* <Tab.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ title: 'Sign up' }}
                />
                <Tab.Screen name="Login" component={Login} /> */}
        </Tab.Navigator>

    )
}