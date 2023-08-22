import { useContext } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { ThemeContext } from "../context/ThemeContext"
import Text from "./Text"

export default function button({ colour, text, cb }: { colour: 'green' | 'purple' | 'orange' | 'yellow', text: String, cb: () => void }) {
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        button: {
            fontFamily: 'Syne',
            backgroundColor: theme.colours.primary[colour],
            ...theme.shadow,
            ...theme.border,
            borderRadius: 5,
            padding: 5,
            marginHorizontal: 20,
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
    return (
        <Pressable style={styles.button} onPress={cb}>
            <Text text={text} tag='body' />
        </Pressable>
    )
}
