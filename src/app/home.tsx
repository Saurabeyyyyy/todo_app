import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTaskBar from "../../components/AddTaskBar";
import Header from "../../components/Header";
import TaskCard from "../../components/TaskCard";

import { Item, Priority } from "../../utils/task";
import { loadTasks, saveTasks } from "../../utils/storage";
import { generateId } from "../../utils/uuid";

function updateItemInTree(
  items: Item[],
  id: string,
  updater: (item: Item) => Item
): Item[] {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (item.id === id) {
      return updater(item);
    }

    const childItems = item.children ?? [];

    if (childItems.length > 0) {
      return {
        ...item,
        children: updateItemInTree(childItems, id, updater),
      };
    }

    return item;
  });
}

function deleteItemFromTree(items: Item[], id: string): Item[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: deleteItemFromTree(item.children ?? [], id),
    }));
}

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const stored = await loadTasks();
      setItems(Array.isArray(stored) ? stored : []);
      setLoading(false);
    };

    fetch();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTasks(items);
    }
  }, [items, loading]);

  const addRootTask = useCallback((title: string, priority: Priority) => {
    const newItem: Item = {
      id: generateId(),
      title,
      priority,
      completed: false,
      children: [],
      subtasks: [],
    };

    setItems((prev) => [newItem, ...prev]);
  }, []);

  const addChild = useCallback((parentId: string, title: string) => {
    setItems((prev) =>
      updateItemInTree(prev, parentId, (item) => ({
        ...item,
        children: [
          ...(item.children ?? []),
          {
            id: generateId(),
            title,
            completed: false,
            children: [],
            subtasks: [],
          },
        ],
      }))
    );
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      updateItemInTree(prev, id, (item) => ({
        ...item,
        completed: !item.completed,
      }))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => deleteItemFromTree(prev, id));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="mx-auto w-full max-w-xl flex-1">
        <Header />

        <AddTaskBar onAddTask={addRootTask} />

        <View className="mx-4 flex-1 overflow-hidden rounded-2xl bg-white shadow-sm">
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                item={item}
                onToggle={toggleItem}
                onDelete={deleteItem}
                onAddChild={addChild}
                depth={0}
              />
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}