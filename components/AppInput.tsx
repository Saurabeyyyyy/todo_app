import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

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
            <Text className="mb-1.5 text-sm font-semibold text-neutral-700">{label}</Text>
            <View
                className={`flex-row items-center rounded-full bg-gray-100 px-4 py-3 ${
                    error ? "border border-error" : "border border-transparent"
                }`}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={isPasswordField && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={keyboardType === "email-address" ? "email" : undefined}
                    textContentType={keyboardType === "email-address" ? "emailAddress" : undefined}
                    cursorColor="#000000"
                    selectionColor="rgba(0,0,0,0.2)"
                    caretHidden={false}
                    className="flex-1 text-foreground"
                    style={{ color: "#000000" }}
                />
                {isPasswordField && (
                    <Pressable
                        onPress={() => setIsPasswordVisible((prev) => !prev)}
                        className="ml-2"
                        hitSlop={8}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#6B7280"
                        />
                    </Pressable>
                )}
            </View>

            {error && <Text className="mt-1 text-xs text-error">{error}</Text>}
        </View>
    );
}
