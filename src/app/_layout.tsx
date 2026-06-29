import { Feather } from "@expo/vector-icons";
import { Redirect, Slot, Tabs, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserProvider, useUser } from "../../components/UserContext";
import "../../global.css";

function LogoutTabButton(props: any) {
  const { logout } = useUser();
  const router = useRouter();

   const handlePress = async () => {
    await logout();
    router.replace("/auth/login");
    Alert.alert("Success", "Logout successful.");
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={handlePress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
      }}
    >
      <Feather name="log-out" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

function AppRoutes() {
  const { user, loading } = useUser();
  const segments = useSegments();
  const inAuthGroup = segments[0] === "auth";

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!user) {
    if (inAuthGroup) {
      return <Slot />;
    }
    return <Redirect href="/auth/login" />;
  }

  if (inAuthGroup) {
    return <Redirect href="/home" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          display: "none",
        },
        tabBarItemStyle: {
          flex: 1,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="logout"
        options={{
          title: "",
          tabBarButton: (props) => <LogoutTabButton {...props} />,
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <AppRoutes />
      </SafeAreaView>
    </UserProvider>
  );
}
