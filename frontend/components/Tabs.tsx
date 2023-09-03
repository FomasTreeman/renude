import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react'
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemeContext } from '../context/ThemeContext';

import Upload from '../screens/Upload';
import Listings from '../screens/Listings';
import Listing from '../screens/Listing';
import Account from '../screens/Account';
import Search from '../screens/Search';

const Tab = createBottomTabNavigator()
const ListingsStack = createNativeStackNavigator();

const images = {
    account: require('../assets/account.svg'),
    search: require('../assets/search.svg'),
    upload: require('../assets/upload.svg'),
    listings: require('../assets/listings.svg'),
}

function ListingsStackScreen() {
    return (
        <ListingsStack.Navigator screenOptions={{ headerShown: false }}>
            <ListingsStack.Screen name="Listings" component={Listings} />
            <ListingsStack.Screen name="Listing" component={Listing} />
        </ListingsStack.Navigator >
    )
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
        <Tab.Navigator screenOptions={{ tabBarStyle: style.navbar, headerShown: false }}>
            <Tab.Screen
                name="Listings"
                component={ListingsStackScreen}
                options={{
                    title: 'Listings',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon focused={focused} size={size} imageKey='listings' />
                    )
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    title: 'Search', tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon focused={focused} size={size} imageKey='search' />
                    ),
                }}
            />
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
            backgroundColor: theme.colours.primary.yellow,
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
