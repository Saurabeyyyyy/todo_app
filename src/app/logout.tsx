import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useUser } from "../../components/UserContext";

export default function LogoutScreen() {
  const { logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      await logout();
      router.replace("/auth/login");
    };

    signOut();
  }, [logout, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
});
