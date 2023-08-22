import { useContext } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { ThemeContext } from "../context/ThemeContext"

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
        }
    })
    return (
        <Pressable style={styles.button} onPress={cb}>
            <Text> {text} </Text>
        </Pressable>
    )
}
