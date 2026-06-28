import { Ionicons } from "@expo/vector-icons";
import { ID } from "react-native-appwrite";
import { account } from "../../appwrite/config";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import AppButton from "../../../components/AppButton";
import AppInput from "../../../components/AppInput";
import AuthScreen from "../../../components/AuthScreen";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

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

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            await account.create(
            ID.unique(),
            email.trim(),
            password,
            name.trim()
            );

            alert("Account created successfully!");

            router.replace("/auth/login");
        } catch (error: any) {
            setErrors({
            email: error.message || "Registration failed.",
            });
        } finally {
            setLoading(false);
        }
        };

    return (
        <AuthScreen centerContent={false}>
            <View className="rounded-3xl bg-white p-8 shadow-sm">
                <View className="mb-6 flex-row items-center gap-4">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-black">
                        <Ionicons name="person-add-outline" size={22} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-foreground">Create Account</Text>
                        <Text className="mt-1 text-sm text-neutral-500">
                            Sign up to start organizing your tasks.
                        </Text>
                    </View>
                </View>

                <AppInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    error={errors.name}
                />

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
                    placeholder="At least 8 characters"
                    secureTextEntry
                    error={errors.password}
                />

                <AppInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                    error={errors.confirmPassword}
                />

                <View className="mt-2">
                    <AppButton
                        className="w-full rounded-full bg-black py-3.5"
                        title={loading ? "Creating account..." : "Register"}
                        onPress={handleRegister}
                        disabled={loading}
                    />
                </View>

                <Text className="mt-6 text-center text-neutral-500">
                    {"Already have an account? "}
                    <Link href="/auth/login" className="font-semibold text-foreground">
                        Log In
                    </Link>
                </Text>
            </View>
        </AuthScreen>
    );
}