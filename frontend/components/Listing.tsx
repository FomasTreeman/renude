/* eslint-disable react-native/no-color-literals */ // temp
import { useContext, useEffect, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { NavigationContext } from '@react-navigation/native';
import { Image } from "expo-image"

import { ThemeContext } from "../context/ThemeContext"

import Text from "./Text"

interface IListingProps {
    listing: { // get listing type
        price: number,
        description: string | null,
        sold?: boolean,
        image: { path: string }[],
    },
    previousScreen?: string,
    height?: number,
    width?: number,
    footerSize?: 'sm' | 'md' | 'lg'
}

const SIZES = {
    sm: 0.2,
    md: 0.3,
    lg: 0.4
}

export default function Listing({ listing, previousScreen, height = 200, width = 250, footerSize = 'sm' }: IListingProps) {
    const theme = useContext(ThemeContext)
    const navigation = useContext(NavigationContext);

    const [url, setUrl] = useState('')

    useEffect(() => {
        async function getUrl() {
            if (listing.image.length === 0) return // can be removed once enforced 
            try {
                const response = await fetch(
                    `http://localhost:3001/listing/images/${listing.image[0].path}`,
                );
                const urlRes = await response.text();
                setUrl(urlRes)
            } catch (error) {
                console.error(error);
            }
        }
        getUrl()
    }, [])

    const styles = StyleSheet.create({
        container: {
            height: height + 5,
            width: width + 6,
            marginRight: 15,
            marginLeft: 10,
            borderRadius: 15,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderWidth: 3,
            backgroundColor: '#FFF',
            ...theme.shadowLg,

        },
        image: {
            height: height * 1 - SIZES[footerSize],
            width: width,
            objectFit: 'contain',
            justifyContent: 'center',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: '#000',
        },
        footer: {
            height: height * SIZES[footerSize],
            width: width + 6,
            backgroundColor: '#fff',
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 5,
            borderWidth: 3,
            marginLeft: -3,
            ...theme.shadowLg,
        },
    })
    return (
        // 3 for border, 8 for shadow, 9 for scroll bar
        <Pressable onPress={() => previousScreen && navigation?.navigate('Listing', { listing, previousScreen })} style={{ height: height + (height * SIZES[footerSize]) + 3 + 8 + 9, marginTop: 15 }}>
            <View style={styles.container}>
                <Image testID='listing-image' source={url} style={styles.image} />
                <View style={styles.footer}>
                    {listing.description ?
                        <Text tag='body' style={{ maxWidth: width / 3 }}> {listing.description}</Text>
                        : null
                    }
                    <Text tag='h4' >£{listing.price.toString()} </Text>
                </View>
            </View>
        </Pressable>
    )
}