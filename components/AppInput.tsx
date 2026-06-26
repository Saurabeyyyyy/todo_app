import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    error?: string;
}

export default function AppInput({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize = "sentences",
    error,
}: AppInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordField = secureTextEntry === true;

    return (
        <View className="mb-4">
            <Text className="mb-1.5 font-medium text-foreground">{label}</Text>
            <View
                className={`flex-row items-center rounded-lg border ${
                    error ? "border-error" : "border-border"
                }`}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#737373"
                    secureTextEntry={isPasswordField && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={keyboardType === "email-address" ? "email" : undefined}
                    textContentType={keyboardType === "email-address" ? "emailAddress" : undefined}
                    cursorColor="#000000"
                    selectionColor="rgba(98, 0, 238, 0.35)"
                    caretHidden={false}
                    className="flex-1 p-2.5 text-foreground"
                    style={{ color: "#000000" }}
                />
                {isPasswordField && (
                    <Pressable
                        onPress={() => setIsPasswordVisible((prev) => !prev)}
                        className="px-2.5"
                        hitSlop={8}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                            size={18}
                            color="#000000"
                        />
                    </Pressable>
                )}
            </View>

            {error && <Text className="mt-1 text-xs text-error">{error}</Text>}
        </View>
    );
}
