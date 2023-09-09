import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Text as DefaultText, TextProps, TextStyle, StyleProp, View } from "react-native";
import type { TextVariants } from '../types'
import { styled } from "nativewind";

interface Props {
    children: string | string[],
    textStyle?: TextProps["style"],
    style?: StyleProp<TextStyle>,
    tag: TextVariants
}

function Text({ children, textStyle, tag, style }: Props) {
    const theme = useContext(ThemeContext)
    return (
        <View style={[textStyle, style]} >
            <DefaultText style={theme.textVariants[tag] as StyleProp<TextStyle>} >{children}</DefaultText>
        </View>
    )
}

export default styled(Text, {
    props: {
        textStyle: true
    }
})
