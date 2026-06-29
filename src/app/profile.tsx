import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoutModal from "../../components/LogoutModal";
import { useUser } from "../../components/UserContext";
import { Item } from "../../utils/task";
import { account } from "../appwrite/config";
import { getUserTasks } from "../appwrite/tasks";

function countItems(list: Item[]): number {
  if (!Array.isArray(list)) return 0;
  let count = 0;
  for (const item of list) {
    count += 1 + countItems(item.children ?? []);
  }
  return count;
}

function countCompleted(list: Item[]): number {
  if (!Array.isArray(list)) return 0;
  let count = 0;
  for (const item of list) {
    if (item.completed) count += 1;
    count += countCompleted(item.children ?? []);
  }
  return count;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [taskStats, setTaskStats] = useState({ total: 0, done: 0, pending: 0 });

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [memberSince] = useState(user?.memberSince || "");

  const loadTaskStats = useCallback(async () => {
    if (!user) {
      setTaskStats({ total: 0, done: 0, pending: 0 });
      return;
    }

    try {
      const currentUser = await account.get();
      const response = await getUserTasks(currentUser.$id);
      if (!response.success) {
        throw new Error(response.error || "Unable to load task stats.");
      }

      const items = Array.isArray(response.data) ? response.data : [];
      const total = countItems(items);
      const done = countCompleted(items);

      setTaskStats({ total, done, pending: Math.max(total - done, 0) });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load task stats.");
    }
  }, [user]);

  useEffect(() => {
    loadTaskStats();
  }, [loadTaskStats]);

  useFocusEffect(
    useCallback(() => {
      loadTaskStats();
    }, [loadTaskStats])
  );

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-100">
        <Text className="text-lg font-semibold">Not logged in</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Error", "Name and email cannot be empty.");
      return;
    }

    try {
      await account.updateName(fullName.trim());
      updateUser({ fullName: fullName.trim(), email: email.trim() });
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setEmail(user.email);
    setIsEditing(false);
  };


  const initial = fullName.charAt(0).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 items-center justify-center px-4">
        <View className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-sm">
          <View className="flex-row items-center justify-between border-b border-neutral-100 px-6 py-4">
            <Text className="text-xl font-bold text-foreground">Profile</Text>
            <Pressable onPress={() => router.replace("/home")} hitSlop={8}>
              <Feather name="x" size={22} color="#9CA3AF" />
            </Pressable>
          </View>

          <View className="items-center px-6 pb-2 pt-6">
            <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-black">
              <Text className="text-3xl font-bold text-white">{initial}</Text>
            </View>
            <Text className="text-xl font-bold text-foreground">{fullName}</Text>
            <Text className="mt-1 text-sm text-neutral-500">User</Text>
          </View>

          <View className="gap-3 px-6 py-4">
            <View className="flex-row items-center rounded-2xl bg-neutral-50 px-4 py-3">
              <Feather name="user" size={18} color="#9CA3AF" />
              <View className="ml-3 flex-1">
                <Text className="text-xs text-neutral-500">Full Name</Text>
                {isEditing ? (
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    className="mt-0.5 text-base font-semibold text-foreground"
                    style={{ color: "#111827" }}
                  />
                ) : (
                  <Text className="mt-0.5 text-base font-semibold text-foreground">{user.fullName}</Text>
                )}
              </View>
              {!isEditing && (
                <Pressable
                  onPress={() => {
                    setIsEditing(true);
                    setFullName(user.fullName);
                    setEmail(user.email);
                  }}
                >
                  <Feather name="edit-2" size={16} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            <View className="flex-row items-center rounded-2xl bg-neutral-50 px-4 py-3">
              <Feather name="mail" size={18} color="#9CA3AF" />
              <View className="ml-3 flex-1">
                <Text className="text-xs text-neutral-500">Email</Text>
                {isEditing ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="mt-0.5 text-base font-semibold text-foreground"
                    style={{ color: "#111827" }}
                  />
                ) : (
                  <Text className="mt-0.5 text-base font-semibold text-foreground">{user.email}</Text>
                )}
              </View>
              {!isEditing && (
                <Pressable
                  onPress={() => {
                    setIsEditing(true);
                    setFullName(user.fullName);
                    setEmail(user.email);
                  }}
                >
                  <Feather name="edit-2" size={16} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            <View className="flex-row items-center rounded-2xl bg-neutral-50 px-4 py-3">
              <Feather name="calendar" size={18} color="#9CA3AF" />
              <View className="ml-3 flex-1">
                <Text className="text-xs text-neutral-500">Member Since</Text>
                <Text className="mt-0.5 text-base font-semibold text-foreground">{memberSince}</Text>
              </View>
            </View>
          </View>

         <View className="border-t border-neutral-100 px-6 py-4">
            <Text className="mb-3 text-xs font-semibold tracking-wider text-neutral-400">TASK STATS</Text>
        <View className="flex-row gap-3">
   
        <View className="flex-1 items-center rounded-2xl bg-neutral-100/60 py-4">
          <Text className="text-2xl font-bold text-neutral-800">{taskStats.total}</Text>
          <Text className="mt-1 text-xs text-neutral-400">Total</Text>
        </View>
    
    
    <View className="flex-1 items-center rounded-2xl bg-indigo-50 py-4">
      <Text className="text-2xl font-bold text-indigo-500">{taskStats.done}</Text>
      <Text className="mt-1 text-xs text-neutral-400">Done</Text>
    </View>
    
    
    <View className="flex-1 items-center rounded-2xl bg-pink-50 py-4">
          <Text className="text-2xl font-bold text-pink-500">{taskStats.pending}</Text>
          <Text className="mt-1 text-xs text-neutral-400">Pending</Text>
        </View>
      </View>
    </View>

          <View className="flex-row items-center justify-end gap-3 border-t border-neutral-100 px-6 py-4">
            {isEditing ? (
              <>
                <Pressable onPress={handleCancel}>
                  <Text className="text-sm font-medium text-neutral-500">Cancel</Text>
                </Pressable>
                <Pressable onPress={handleSave} className="rounded-full bg-black px-5 py-2.5">
                  <Text className="text-sm font-semibold text-white">Save</Text>
                </Pressable>
              </>
            ) : (
              <>
               
                <Pressable onPress={() => router.replace("/home")}>
                  <Text className="text-sm font-semibold text-foreground">Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}
