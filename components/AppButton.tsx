import { Text, TouchableOpacity } from "react-native";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    className?: string;
}

export default function AppButton({ title, onPress, disabled, className }: AppButtonProps) {
    return (
        <TouchableOpacity
            className={`items-center ${className ?? "bg-primary p-4 rounded-full"} ${disabled ? "opacity-50" : ""}`}
            onPress={onPress}
            disabled={disabled}
        >
            <Text className="font-semibold text-white">{title}</Text>
        </TouchableOpacity>
    );
}
