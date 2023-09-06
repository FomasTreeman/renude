import { useContext } from 'react';
import { StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';

import { ThemeContext } from '../context/ThemeContext';

import Text from '../components/Text';

interface IInputProps {
    children?: any, // needs type
    style?: TextStyle,
    // tw?: StyledProps<TextStyle>,
    containerStyle?: ViewStyle,
    // containerTw?: StyledProps<ViewStyle>,
    placeholder: string,
    cb: (x: any) => void,
    [x: string]: any; //rest
}

export default function Input({ children, placeholder, cb, style, containerStyle, ...rest }: IInputProps) {
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        textInput: {
            fontFamily: 'Inter',
            backgroundColor: 'white',
            borderWidth: 2,
            shadowColor: 'black',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0.2,
            padding: 10,
            borderRadius: 7.5,
        },
        textInputLabel: { // doesn't like have absolute here??
            position: 'absolute',
            left: 16,
            fontSize: 16,
            color: 'gray',
            backgroundColor: theme.colours.background,
            paddingHorizontal: 5,
            top: -8,
            zIndex: 1,
            shadowColor: 'none'
        }
    })

    return (
        <View style={{ position: 'relative', ...containerStyle }}>
            <View style={styles.textInputLabel} >
                <Text tag='body'>{placeholder}</Text>
            </View>
            <TextInput
                style={{ ...styles.textInput, ...style }}
                autoCapitalize="none"
                onChangeText={cb}
                {...rest}
            />
            {children}
        </View >
    )
}
