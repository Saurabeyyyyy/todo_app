import { Text, View } from "react-native";

interface FooterStatsProps {
  total: number;
  completed: number;
}

export default function FooterStats({ total, completed }: FooterStatsProps) {
  const remaining = Math.max(total - completed, 0);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View className="mx-4 mb-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-gray-700">Progress</Text>
        <Text className="text-sm text-gray-500">{progress}%</Text>
      </View>

      <View className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <View
          className="h-full rounded-full bg-slate-900"
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="mt-3 flex-row justify-between">
        <Text className="text-xs text-gray-500">Total: {total}</Text>
        <Text className="text-xs text-gray-500">Completed: {completed}</Text>
        <Text className="text-xs text-gray-500">Remaining: {remaining}</Text>
      </View>
    </View>
  );
}