import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();

  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const dateString = now.toLocaleDateString("en-US", options);

  return (
    <View className="pt-14 pb-4 px-5 bg-white flex-row items-center">
      <View className="flex-1">
        <Text className="text-3xl font-bold">Tasks</Text>
        <Text className="text-gray-500 text-base">
          Today <Text className="text-gray-400">{dateString}</Text>
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Feather name="user" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}