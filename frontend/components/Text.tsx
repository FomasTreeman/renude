import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Text as DefaultText, TextProps, TextStyle, StyleProp, View } from "react-native";
import type { TextVariants } from '../types'
import { styled } from "nativewind";

interface Props {
    children: String | String[],
    textStyle?: TextProps["style"],
    tag: TextVariants
}

function Text({ children, textStyle, tag }: Props) {
    const theme = useContext(ThemeContext)
    return (
        <View style={textStyle}>
            <DefaultText style={theme.textVariants[tag] as StyleProp<TextStyle>} > {children} </DefaultText>
        </View>
    )
}

export default styled(Text, {
    props: {
        textStyle: true
    }
})