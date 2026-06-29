import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import LogoutModal from "./LogoutModal";
import { useUser } from "./UserContext";

type HeaderProps = {
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export default function Header({ onRefresh, isRefreshing = false }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initial = (user?.fullName || user?.email || "U").charAt(0).toUpperCase();

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace("/auth/login");
  };

  return (
    <>
      <View className="mx-4 mb-3 mt-2 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-black">
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
        </View>

        <Text className="flex-1 text-lg font-bold text-foreground">Todo App</Text>

        <TouchableOpacity
          onPress={onRefresh}
          disabled={isRefreshing}
          hitSlop={8}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-black"
          style={{ opacity: isRefreshing ? 0.5 : 1 }}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Feather name="refresh-cw" size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="h-9 w-9 items-center justify-center rounded-full bg-black"
        >
          <Text className="text-sm font-bold text-white">{initial}</Text>
        </TouchableOpacity>

        <View className="mx-3 h-6 w-px bg-neutral-200" />

        <TouchableOpacity onPress={() => setShowLogoutModal(true)} hitSlop={8}>
          <Feather name="log-out" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
