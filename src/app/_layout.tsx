import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserProvider, useUser } from "../../components/UserContext";
import "../../global.css";

function LogoutTabButton(props: any) {
  const { logout } = useUser();
  const router = useRouter();

  const handlePress = async () => {
    await logout();
    router.replace("/auth/login");
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

export default function RootLayout() {
  return (
    <UserProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
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
            name="index"
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
      </SafeAreaView>
    </UserProvider>
  );
}