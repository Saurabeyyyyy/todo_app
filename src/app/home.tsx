import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTaskBar from "../../components/AddTaskBar";
import Header from "../../components/Header";
import TaskCard from "../../components/TaskCard";
import { useUser } from "../../components/UserContext";

import { Item, Priority } from "../../utils/task";
import { account } from "../appwrite/config";
import {
  addSubtask,
  createTask,
  deleteTask,
  getUserTasks,
  toggleTask,
  updateTask,
} from "../appwrite/tasks";

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

function findItemInTree(items: Item[], id: string): Item | null {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    const found = findItemInTree(item.children ?? [], id);
    if (found) {
      return found;
    }
  }
  return null;
}

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeAddInputTaskId, setActiveAddInputTaskId] = useState<string | null>(null);
  const [deletingTaskIds, setDeletingTaskIds] = useState<string[]>([]);
  const { user, loading: userLoading } = useUser();

  const refreshTasks = useCallback(async () => {
    setRefreshing(true);

    try {
      const currentUser = await account.get();
      setUserId(currentUser.$id);

      const response = await getUserTasks(currentUser.$id);
      if (!response.success) {
        throw new Error(response.error || "Unable to load tasks.");
      }

      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to refresh tasks.");
    } finally {
      setRefreshing(false);
    }
  }, []);


  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        await refreshTasks();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [refreshTasks]);

  const addRootTask = useCallback(
    async (title: string, priority: Priority) => {
      if (!userId) {
        Alert.alert("Error", "Unable to create task. User not authenticated.");
        return;
      }

      try {
        const response = await createTask({
          taskName: title,
          userId,
          priority,
          description: "",
          parentId: null,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error || "Unable to create task.");
        }

        const newItem: Item = {
          id: response.data.$id,
          title,
          completed: false,
          priority,
          description: "",
          children: [],
        };

        
        Alert.alert("Success", "Task added successfully.");
        await refreshTasks();
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to create task.");
      }
    },
    [userId]
  );

  const addChild = useCallback(
    async (parentId: string, title: string) => {
      if (!userId) {
        Alert.alert("Error", "Unable to add subtask. User not authenticated.");
        return;
      }

      try {
        const response = await addSubtask(parentId, title, userId);
        if (!response.success || !response.data) {
          throw new Error(response.error || "Unable to add subtask.");
        }

        setItems((prev) =>
          updateItemInTree(prev, parentId, (item) => ({
            ...item,
            children: [
              ...((item.children ?? []) as Item[]),
              {
                id: response.data.$id,
                title,
                completed: false,
                priority: response.data.priority || "low",
                description: response.data.description || "",
                children: [],
              },
            ],
          }))
        );

        Alert.alert("Success", "Subtask added successfully.");
        await refreshTasks();
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to add subtask.");
      }
    },
    [userId]
  );

  const toggleItem = useCallback(
    async (id: string) => {
      const item = findItemInTree(items, id);
      if (!item) {
        return;
      }

      try {
        const response = await toggleTask(id, !item.completed);
        if (!response.success) {
          throw new Error(response.error || "Unable to update task.");
        }

        setItems((prev) =>
          updateItemInTree(prev, id, (task) => ({
            ...task,
            completed: !task.completed,
          }))
        );

        Alert.alert("Success", "Task completion updated successfully.");
        await refreshTasks();
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to toggle task.");
      }
    },
    [items]
  );

  const deleteItemTask = useCallback(async (id: string) => {
    if (deletingTaskIds.includes(id)) {
      return;
    }

    const task = findItemInTree(items, id);
    //console.log("Deleting task object:", task);
    //console.log("Deleting task id:", id);

    setDeletingTaskIds((prev) => [...prev, id]);

    try {
      const response = await deleteTask(id);
      //console.log("deleteTask Appwrite response for id", id, response);

      if (!response.success) {
        if (response.error?.toString().toLowerCase().includes("could not be found")) {
          Alert.alert(
            "Task not found",
            "The task was already deleted. Refreshing the task list."
          );
          return;
        }

        throw new Error(response.error || "Unable to delete task.");
      }

      Alert.alert("Success", "Task deleted successfully.");
    } catch (error: any) {
      const message = error?.message || "Failed to delete task.";
      if (message.toLowerCase().includes("could not be found")) {
        Alert.alert(
          "Task not found",
          "The task was already deleted. Refreshing the task list."
        );
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setDeletingTaskIds((prev) => prev.filter((taskId) => taskId !== id));
      await refreshTasks();
      setActiveAddInputTaskId(null);
    }
  }, [deletingTaskIds, refreshTasks, items]);

  const selectAddInputTask = useCallback((taskId: string | null) => {
    setActiveAddInputTaskId(taskId);
  }, []);

  const saveTaskTitle = useCallback(
    async (id: string, title: string) => {
      try {
        const response = await updateTask(id, { taskName: title });
        if (!response.success) {
          throw new Error(response.error || "Unable to update task.");
        }

        setItems((prev) =>
          updateItemInTree(prev, id, (task) => ({
            ...task,
            title,
          }))
        );

        Alert.alert("Success", "Task updated successfully.");
        await refreshTasks();
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to save task title.");
        throw error;
      }
    },
    [refreshTasks]
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="mx-auto w-full max-w-xl flex-1">
        <Header onRefresh={refreshTasks} isRefreshing={refreshing} />

        <AddTaskBar onAddTask={addRootTask} />


        <View className="mx-4 flex-1 overflow-hidden rounded-2xl bg-white shadow-sm">
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TaskCard
                item={item}
                onToggle={toggleItem}
                onDelete={deleteItemTask}
                onAddChild={addChild}
                onSaveTaskTitle={saveTaskTitle}
                onSelectAddInput={selectAddInputTask}
                activeAddInputTaskId={activeAddInputTaskId}
                depth={0}
                number={`${index + 1}`}
              />
              )}


            // renderItem={({ item }) => (
            //   <TaskCard
            //     item={item}
            //     onToggle={toggleItem}
            //     onDelete={deleteItemTask}
            //     onAddChild={addChild}
            //     onSaveTaskTitle={saveTaskTitle}
            //     onSelectAddInput={selectAddInputTask}
            //     activeAddInputTaskId={activeAddInputTaskId}
            //     depth={0}
            //   />
            // )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshTasks} />
            }
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
