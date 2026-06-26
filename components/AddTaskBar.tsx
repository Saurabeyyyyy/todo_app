import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Priority } from "../utils/task";

type Props = {
  onAddTask: (title: string, priority: Priority) => void;
};

export default function AddTaskBar({ onAddTask }: Props) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      onAddTask(title.trim(), "medium");
      setTitle("");
    }
  };

  return (
    <View className="mx-4 mb-3 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm">
      <TextInput
        placeholder="I want to..."
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleAdd}
        className="mr-3 flex-1 text-base text-foreground"
        style={{ color: "#111827" }}
      />

      <TouchableOpacity onPress={handleAdd} className="rounded-xl bg-black px-4 py-2.5">
        <Text className="text-sm font-semibold text-white">Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}
