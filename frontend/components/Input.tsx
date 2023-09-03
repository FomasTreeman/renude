import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { TextInput, View } from 'react-native';
import Text from '../components/Text';

interface IInputProps {
    children?: any, // needs type
    style?: any, //needs style prop type 
    placeholder: string,
    cb: (x: any) => void,
    [x: string]: any; //rest
}

export default function Input({ children, placeholder, cb, style, ...rest }: IInputProps) {
    const theme = useContext(ThemeContext)

    return (
        <View style={{ position: 'relative' }}>
            <View style={[theme.textInputLabel, { position: 'absolute' }]} >
                <Text tag='body'>{placeholder}</Text>
            </View>
            <TextInput
                style={{ ...theme.textInput, ...style }}
                autoCapitalize="none"
                onChangeText={cb}
                {...rest}
            />
            {children}
        </View >
    )
}