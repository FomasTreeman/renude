import { View } from 'react-native';
import Text from './Text';
import Input from './Input';

interface IInputProps {
    placeholder: string,
    type: 'email_address' | "username" | "password",
    errors: Partial<{ [Key in 'email_address' | "username" | "password"]: string }>
    setErrors: any,
    style?: any,
    [x: string]: any; //rest
}

export default function InputError({ setState, placeholder, type, errors, setErrors, style, ...rest }: IInputProps) {

    const hasError = (field: 'email_address' | "username" | "password") => !!errors[field];

    const updateError = (field: string, message: string) => {
        setErrors({ ...errors, [field]: message });
    };

    return (
        <Input
            style={{ borderColor: hasError(type) ? 'red' : 'black' }}
            placeholder={placeholder}
            cb={(x: string) => {
                setState(x);
                if (hasError(type)) {
                    updateError(type, ''); // Clear the error when typing
                }
            }}
            secureTextEntry={type === 'password' ? true : false}
            keyboardType={type === 'email_address' ? 'email-address' : undefined}
            textContentType={type.replace(/_./g, x => x[1].toUpperCase()) as any} // camelize
            {...rest}
        >
            {
                hasError(type) &&
                <View style={{ position: 'absolute', zIndex: 3, bottom: -22, left: 10 }}>
                    <Text tag='error' textStyle='mt-2'>{errors[type] ? errors[type].substring(errors[type].indexOf(" ") + 1) : 'Error'}</Text >
                </View>
            }
        </Input >
    )
}