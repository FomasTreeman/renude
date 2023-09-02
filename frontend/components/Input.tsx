import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { TextInput, View } from 'react-native';
import Text from '../components/Text';

interface IInputProps {
    placeholder: string,
    type: 'email_address' | "username" | "password",
    state: string,
    setState: any,
    errors: Partial<{ [Key in 'email_address' | "username" | "password"]: string }>
    setErrors: any,
}

export default function Input({ state, setState, placeholder, type, errors, setErrors }: IInputProps) {
    const theme = useContext(ThemeContext)

    const hasError = (field: 'email_address' | "username" | "password") => !!errors[field];

    const updateError = (field: string, message: string) => {
        setErrors({ ...errors, [field]: message });
    };

    return (
        <View style={{ position: 'relative' }}>
            <View style={[theme.textInputLabel, { position: 'absolute' }]} >
                <Text tag='body'>{placeholder}</Text>
            </View>

            <TextInput
                style={{ ...theme.textInput, borderColor: hasError(type) ? 'red' : 'black' }}
                autoCapitalize="none"
                value={state}
                secureTextEntry={type === 'password' ? true : false}
                keyboardType={type === 'email_address' ? 'email-address' : undefined}
                textContentType={type.replace(/_./g, x => x[1].toUpperCase()) as any} // camelise
                onChangeText={(x: string) => {
                    setState(x);
                    if (hasError(type)) {
                        updateError(type, ''); // Clear the error when typing
                    }
                }}
            />

            {
                hasError(type) &&
                <View style={{ position: 'absolute', zIndex: 3, bottom: -22, left: 10 }}>
                    <Text tag='error' textStyle='mt-2'>{errors[type] ? errors[type].substring(errors[type].indexOf(" ") + 1) : 'Error'}</Text >
                </View>
            }
        </View >
    )
}