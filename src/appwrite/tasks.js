import { ID, Query } from "react-native-appwrite";
import { databases, DB_ID, TASKS_COLLECTION_ID } from "./config";

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await databases.createDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      {
        taskName: taskData.taskName,
        is_completed: false,
        userId: taskData.userId,
        priority: taskData.priority || "medium",
        description: taskData.description || "",
        parentId: taskData.parentId ?? null,
      }
    );
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all tasks for a user and build nested tree
export const getUserTasks = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
      ]
    );

    const tasks = response.documents;
    const taskMap = {};
    const rootTasks = [];

    const normalizeParentId = (parentId) => {
      if (parentId === null || parentId === undefined) {
        return null;
      }

      const normalized = String(parentId).trim();
      if (!normalized || normalized === "null" || normalized === "undefined") {
        return null;
      }

      return normalized;
    };

    tasks.forEach((task) => {
      taskMap[task.$id] = {
        id: task.$id,
        title: task.taskName,
        completed: task.is_completed,
        priority: task.priority || "medium",
        description: task.description || "",
        parentId: normalizeParentId(task.parentId),
        children: [],
        createdAt: task.$createdAt,
        updatedAt: task.$updatedAt,
      };
    });

    tasks.forEach((task) => {
      const currentTask = taskMap[task.$id];
      const parentId = normalizeParentId(task.parentId);

      if (parentId && taskMap[parentId]) {
        taskMap[parentId].children.push(currentTask);
      } else {
        rootTasks.push(currentTask);
      }
    });

    return { success: true, data: rootTasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update a task
export const updateTask = async (taskId, updatedFields) => {
  try {
    const dbFields = {};
    if (updatedFields.taskName !== undefined) dbFields.taskName = updatedFields.taskName;
    if (updatedFields.is_completed !== undefined) dbFields.is_completed = updatedFields.is_completed;
    if (updatedFields.priority !== undefined) dbFields.priority = updatedFields.priority;
    if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
    if (updatedFields.parentId !== undefined) dbFields.parentId = updatedFields.parentId;

    const response = await databases.updateDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      taskId,
      dbFields
    );
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a task and all nested subtasks
export const deleteTask = async (taskId) => {
  try {
    const subtasks = await databases.listDocuments(
      DB_ID,
      TASKS_COLLECTION_ID,
      [Query.equal("parentId", taskId)]
    );

    for (const subtask of subtasks.documents) {
      const response = await deleteTask(subtask.$id);
      if (!response.success) {
        return response;
      }
    }

    await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, taskId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Toggle task completion
export const toggleTask = async (taskId, completed) => {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      taskId,
      { is_completed: completed }
    );
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add subtask
export const addSubtask = async (parentId, taskName, userId) => {
  return await createTask({
    taskName,
    userId,
    parentId,
    priority: "low",
    description: "",
  });
};

// Get a single task
export const getTask = async (taskId) => {
  try {
    const response = await databases.getDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      taskId
    );
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};