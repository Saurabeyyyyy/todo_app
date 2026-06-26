import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import AppButton from "../../../components/AppButton";
import AppInput from "../../../components/AppInput";
import AuthScreen from "../../../components/AuthScreen";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            await AsyncStorage.setItem("user", JSON.stringify({ email: email.trim() }));
            router.replace("/home");
        } catch {
            setErrors({ email: "Login failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreen>
            <View className="flex-row items-start mb-6">
                <View className="w-12 h-12 rounded-lg bg-black items-center justify-center mr-4">
                    <Ionicons name="person-outline" size={20} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                    <Text className="text-[24px] font-bold text-foreground">Welcome Back</Text>
                    <Text className="mt-1 text-sm text-neutral-500">Log in to access your todos.</Text>
                </View>
            </View>

            <Text className="sr-only">Sign in form</Text>

            <AppInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
            />

            <AppInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
            />

                <View className="mt-4">
                    <AppButton className="bg-black p-4" title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
                </View>

            <Text className="mt-6 text-center text-neutral-500">
                {"Don't have an account? "}
                <Link href="/auth/register" className="font-semibold text-black">
                    Register
                </Link>
            </Text>
        </AuthScreen>
    );
}
