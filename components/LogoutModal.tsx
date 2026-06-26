import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ visible, onCancel, onConfirm }: LogoutModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={onCancel}>
        <Pressable
          className="w-full max-w-sm overflow-hidden rounded-2xl bg-white"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="items-center px-6 pb-6 pt-8">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Feather name="log-out" size={22} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-foreground">Log out?</Text>
            <Text className="mt-2 text-center text-sm text-neutral-500">
              Are you sure you want to logout?
            </Text>
          </View>

          <View className="flex-row items-center justify-end gap-4 bg-neutral-50 px-6 py-4">
            <Pressable onPress={onCancel}>
              <Text className="text-sm font-medium text-neutral-500">Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className="rounded-full bg-black px-5 py-2.5">
              <Text className="text-sm font-semibold text-white">Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
