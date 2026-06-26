import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from './task';

const STORAGE_KEY = 'tasks';

// Helper to ensure every item has task arrays for both screen variants
const ensureChildren = (items: any[]): Item[] => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    ...item,
    children: Array.isArray(item.children) ? ensureChildren(item.children) : [],
    subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
  }));
};

export const loadTasks = async (): Promise<Item[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      return ensureChildren(parsed);
    }
    return [];
  } catch (error) {
    console.error('Failed to load tasks', error);
    return [];
  }
};

export const saveTasks = async (tasks: Item[]) => {
  try {
    if (!Array.isArray(tasks)) return;
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save tasks', error);
  }
};