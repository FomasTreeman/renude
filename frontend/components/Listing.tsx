import { Image } from "expo-image"
import Text from "./Text"
import { StyleSheet, View } from "react-native"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../context/ThemeContext"

export default function Listing({ price, description, sold, image }) {
    const theme = useContext(ThemeContext)
    const [url, setUrl] = useState('')

    useEffect(() => {
        async function getUrl() {
            try {
                const response = await fetch(
                    `http://localhost:3001/listing/images/${image[0].path}`,
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
            maxWidth: 255,
            maxHeight: 188,
            marginTop: 20,
            marginRight: 15,
            marginLeft: 10,
            ...theme.shadowLg,
            ...theme.border,
            borderWidth: 2,
            borderRadius: 15,
        },
        image: {
            objectFit: 'contain',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
        },
        footer: {
            width: 250,
            backgroundColor: 'white',
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 5,
            borderTopWidth: 2,
        },
    })
    return (
        <View style={styles.container}>
            {/* <Image source={require('../assets/icon.png')} style={{ width: 250, height: 150, ...styles.image }} /> */}
            <Image source={url} style={{ width: 250, height: 150, ...styles.image }} />
            <View style={styles.footer}>
                <Text tag='body' > {description} </Text>
                <Text tag='h4' > £{price} </Text>
            </View>
        </View>
    )
}