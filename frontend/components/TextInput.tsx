import { StyleSheet, TextInput } from "react-native"

export default function StyledTextInput({ type, value, placeholder, cb }) {
    return (
        <TextInput
            style={styles.input}
            onChangeText={cb}
            value={value}
            placeholder={placeholder}
            keyboardType={type}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'black'
    }
})