import { useContext, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import Text from "./Text";

export default function Continue({ cb }: { cb: () => void }) {
    const theme = useContext(ThemeContext)
    const [pressed, setPressed] = useState(false)

    const styles = StyleSheet.create({
        button: {
            backgroundColor: pressed ? theme.colours.secondary.green : theme.colours.primary.green,
            ...theme.shadow,
            ...theme.border,
            borderRadius: 50,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            transform: pressed ? 'scale(1.5)' : 'scale(1)',
        }
    })

    return (
        <Pressable onPress={cb} onPressIn={() => { setPressed(true) }} onPressOut={() => { setPressed(false) }} style={styles.button} >
            <Text text='→' tag='h2' />
        </Pressable >
    )
}