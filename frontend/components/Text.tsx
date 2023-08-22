import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Text as DefaultText, StyleProp, TextStyle } from "react-native";
import type { TextVariants } from '../types'

export default function Text({ tag, text, tw = '' }: { tag: TextVariants, text: String, tw?: string }) {
    const theme = useContext(ThemeContext)
    return (
        <DefaultText style={theme.textVariants[tag] as StyleProp<TextStyle>} className={tw}> {text} </DefaultText>
    )
}