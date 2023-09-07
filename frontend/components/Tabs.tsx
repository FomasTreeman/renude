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
const SearchStack = createNativeStackNavigator();

const SCREENS = {
    HomeTabs: { component: ListingsTabs, image: require('../assets/listings.svg') },
    SearchTabs: { component: SearchTabs, image: require('../assets/search.svg') },
    Upload: { component: Upload, image: require('../assets/upload.svg') },
    Account: { component: Account, image: require('../assets/account.svg') }
}


function ListingsTabs() {
    return (
        <ListingsStack.Navigator screenOptions={{ headerShown: false }}>
            <ListingsStack.Screen name="Listings" component={Listings} />
            <ListingsStack.Screen name="Listing" component={Listing} />
        </ListingsStack.Navigator >
    )
}

function SearchTabs() {
    return (
        <SearchStack.Navigator screenOptions={{ headerShown: false }}>
            <ListingsStack.Screen name="Search" component={Search} />
            <ListingsStack.Screen name="Listing" component={Listing} />
        </SearchStack.Navigator >
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
            {Object.entries(SCREENS).map(([key, { component }]) => (
                <Tab.Screen
                    key={key}
                    name={key}
                    component={component}
                    options={{
                        title: key,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused, size }) => (
                            <Icon focused={focused} size={size} imageKey={key as keyof typeof SCREENS} />
                        )
                    }}
                />
            ))}
        </Tab.Navigator >

    )
}

const Icon = ({ focused, size, imageKey }: { focused: boolean, size: number, imageKey: keyof typeof SCREENS }) => {
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
            <Image source={SCREENS[imageKey].image} style={{ width: size, height: size }} />
        </View>
    )
}
