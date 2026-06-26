import { Ionicons } from "@expo/vector-icons";
import { account } from "../../appwrite/config";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";import AppButton from "../../../components/AppButton";
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
            // Create a login session
            await account.createEmailPasswordSession(
            email.trim(),
            password
            );

    // Get logged in user
    const user = await account.get();

    console.log("Logged in:", user);

    router.replace("/home");
  } catch (error: any) {
    setErrors({
      email: error.message || "Invalid email or password",
    });
  } finally {
    setLoading(false);
  }
};

    return (
        <AuthScreen>
            <View className="rounded-3xl bg-white p-8 shadow-sm">
                <View className="items-center">
                    <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-black">
                        <Ionicons name="person-outline" size={22} color="#FFFFFF" />
                    </View>

                    <Text className="text-center text-2xl font-bold text-foreground">Welcome Back</Text>
                    <Text className="mt-1 text-center text-sm text-neutral-500">
                        Log in to access your todos.
                    </Text>
                </View>

                <View className="mt-6">
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

                    <View className="mt-2">
                        <AppButton
                            className="w-full rounded-full bg-black py-3.5"
                            title={loading ? "Logging in..." : "Login"}
                            onPress={handleLogin}
                            disabled={loading}
                        />
                    </View>

                    <Text className="mt-6 text-center text-neutral-500">
                        {"Don't have an account? "}
                        <Link href="/auth/register" className="font-semibold text-foreground">
                            Register
                        </Link>
                    </Text>
                </View>
            </View>
        </AuthScreen>
    );
}
