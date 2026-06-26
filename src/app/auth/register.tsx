import { useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
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
            await AsyncStorage.setItem(
                "registered_user",
                JSON.stringify({ name: name.trim(), email: email.trim() })
            );
            router.push("/auth/login");
        } catch {
            setErrors({ email: "Sign up failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreen centerContent={false}>
            <Text className="mb-2 text-[28px] font-bold text-foreground">Create account</Text>
            <Text className="mb-8 text-base text-neutral-500">
                Sign up to start organizing your tasks
            </Text>

            <AppInput
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
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
                placeholder="Create a password"
                secureTextEntry
                error={errors.password}
            />

            <AppInput
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                secureTextEntry
                error={errors.confirmPassword}
            />

            <AppButton className="bg-black p-4" title="Sign up" onPress={handleRegister} disabled={loading} />

            <Text className="mt-6 text-center text-foreground">
                {"Already have an account? "}
                <Link href="/auth/login" className="font-semibold text-primary">
                    Log in
                </Link>
            </Text>
        </AuthScreen>
    );
}
