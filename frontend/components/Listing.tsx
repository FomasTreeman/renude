import { Image } from "expo-image"
import Text from "./Text"
import { StyleSheet, View } from "react-native"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../context/ThemeContext"

interface IListingProps {
    price: number,
    description: string | null,
    sold: boolean,
    image: any,
    height?: number,
    width?: number,
    footerSize?: 'sm' | 'md' | 'lg'
}

const SIZES = {
    sm: 0.2,
    md: 0.3,
    lg: 0.4
}

export default function Listing({ price, description, sold, image, height = 200, width = 250, footerSize = 'sm' }: IListingProps) {
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
            height: height + 5,
            width: width + 6,
            marginRight: 15,
            marginLeft: 10,
            borderRadius: 15,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderWidth: 3,
            backgroundColor: 'white',
            ...theme.shadowLg,

        },
        image: {
            height: height * 1 - SIZES[footerSize],
            width: width,
            objectFit: 'contain',
            justifyContent: 'center',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: 'black',
        },
        footer: {
            height: height * SIZES[footerSize],
            width: width + 6,
            backgroundColor: 'white',
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
        <View style={{ height: height + (height * SIZES[footerSize]) + 3 + 8 + 9, marginTop: 15 }}>
            <View style={styles.container}>
                <Image source={url} style={styles.image} />
                <View style={styles.footer}>
                    {description ?
                        <Text tag='body' style={{ maxWidth: width / 3 }}> {description}</Text>
                        : null
                    }
                    <Text tag='h4' >£{price.toString()} </Text>
                </View>
            </View>
        </View>
    )
}