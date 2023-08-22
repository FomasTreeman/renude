import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';

import { useContext } from 'react'
import Upload from '../screens/Upload';
import Listings from '../screens/Listings';
import Account from '../screens/Account';
import { ThemeContext } from '../context/ThemeContext';
import { StyleSheet, View } from 'react-native';
// import Search from '../screens/Search';

const Tab = createBottomTabNavigator()

const images = {
    account: require('../assets/account.svg'),
    search: require('../assets/search.svg'),
    upload: require('../assets/upload.svg'),
    listings: require('../assets/listings.svg'),
}

export default function Tabs() {
    const theme = useContext(ThemeContext)
    const style = StyleSheet.create({
        navbar: {
            position: 'absolute',
            backgroundColor: theme.colours.primary.purple,
            borderRadius: 13,
            margin: 25,
            ...theme.border,
            borderTopWidth: 3,
            borderWidth: 3,
            ...theme.shadow
        },
    })

    return (
        <Tab.Navigator screenOptions={{ tabBarStyle: style.navbar }}>
            <Tab.Screen
                name="Listings"
                component={Listings}
                options={{
                    title: 'Listings',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon focused={focused} size={size} imageKey='listings' />
                    )
                }}
            />
            {/* <Tab.Screen
                name="Search"
                component={Search}
                options={{ title: 'Search', tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon focused={focused} size={size} imageKey='search' />
                    ), }}
            /> */}
            <Tab.Screen
                name="Upload"
                component={Upload}
                options={{
                    title: 'Upload listing',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon focused={focused} size={size} imageKey='upload' />
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    title: 'Account', tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon focused={focused} size={size} imageKey='account' />
                    ),
                }}
            />
        </Tab.Navigator >

    )
}

const Icon = ({ focused, size, imageKey }: { focused: boolean, size: number, imageKey: keyof typeof images }) => {
    const theme = useContext(ThemeContext);
    const styles = StyleSheet.create({
        icon: {
            width: size + 15,
            height: size + 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        iconHover: {
            borderRadius: 5,
            backgroundColor: theme.colours.primary.orange,
            ...theme.border,
            borderWidth: 2
        }
    })

    return (
        <View style={focused ? { ...styles.icon, ...styles.iconHover } : { ...styles.icon }}>
            <Image source={images[imageKey]} style={{ width: size, height: size }} />
        </View>
    )
}
