import {Text, StyleSheet, TouchableOpacity} from "react-native";
import {colors} from "../constants/colors";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}
export default function AppButton({title, onPress, disabled}: AppButtonProps    ) {
    return (
       <TouchableOpacity
           style={[styles.button, disabled && styles.buttonDisabled]}
           onPress={onPress}    
           disabled={disabled}
         >
            <Text style={styles.text}>{title}</Text>
         </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.5,    },
    text: {
        color: "#ff",
        fontWeight: "600",
    },});