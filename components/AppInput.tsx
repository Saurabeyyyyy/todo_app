import { Text, TextInput, View, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

interface AppInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
}

export default function AppInput({ label, value, onChangeText, secureTextEntry, error }: AppInputProps) {
    return (
        <View style={styles.container}>
            {/* Display the Input Label */}
            <Text style={styles.label}>{label}</Text>
            
            {/* The actual TextInput area */}
            <TextInput
                style={[
                    styles.input, 
                    error ? styles.errorBorder : null // Turns border red if there's an error
                ]}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />

            {/* Conditionally display error message if it exists */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    }, // Fixed: Properly closed container here
    label: {
        marginBottom: 6, 
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
    },
    errorBorder: { // Tip: camelCase is standard practice in JS/TS (changed from errorborder)
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        marginTop: 4,
        fontSize: 12,
    },
});