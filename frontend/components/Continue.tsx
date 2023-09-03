import { useContext, useState } from "react";
import { Pressable, View, StyleSheet, ViewStyle } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import Text from "./Text";

export default function Continue({ cb, style, isError = false }: { cb: () => void, style?: ViewStyle, isError?: boolean }) {
    const theme = useContext(ThemeContext)
    const [pressed, setPressed] = useState(false)

    const styles = StyleSheet.create({
        button: {
            backgroundColor: isError ? 'red' : pressed ? theme.colours.secondary.green : theme.colours.primary.green,
            ...theme.shadow,
            ...theme.border,
            borderRadius: 50,
            width: 45,
            height: 45,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            transform: pressed ? 'scale(1.2)' : 'scale(1)',
        }
    })

    return (
        <Pressable onPress={cb} onPressIn={() => { setPressed(true) }} onPressOut={() => { setPressed(false) }} style={{ ...styles.button, ...style }} >
            <Text tag='h2'>→ </Text>
        </Pressable >
    )
}