// frontend/src/appwrite/tasks.js
import { databases, DB_ID, TASKS_COLLECTION_ID } from "./config";
import { ID, Query } from "appwrite";

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
        parentId: taskData.parentId || null, // null for main tasks
      }
    );
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all tasks for a user (including subtasks)
export const getUserTasks = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DB_ID, 
      TASKS_COLLECTION_ID, 
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt")
      ]
    );
    
    // Build task tree with subtasks
    const tasks = response.documents;
    const taskMap = {};
    const mainTasks = [];

    // First pass: create map of all tasks
    tasks.forEach(task => {
      taskMap[task.$id] = {
        id: task.$id,
        text: task.taskName,
        completed: task.is_completed,
        priority: task.priority,
        description: task.description,
        parentId: task.parentId,
        subTodos: [],
        createdAt: task.$createdAt,
        updatedAt: task.$updatedAt
      };
    });

    // Second pass: build tree
    tasks.forEach(task => {
      if (task.parentId && taskMap[task.parentId]) {
        // This is a subtask - add to parent's subTodos
        taskMap[task.parentId].subTodos.push(taskMap[task.$id]);
      } else if (!task.parentId) {
        // This is a main task
        mainTasks.push(taskMap[task.$id]);
      }
    });

    return { success: true, data: mainTasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update a task
export const updateTask = async (taskId, updatedFields) => {
  try {
    // Map frontend field names to database field names
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

// Delete a task (and all its subtasks)
export const deleteTask = async (taskId) => {
  try {
    // First, get all subtasks
    const subtasks = await databases.listDocuments(
      DB_ID,
      TASKS_COLLECTION_ID,
      [Query.equal("parentId", taskId)]
    );

    // Delete all subtasks first
    for (const subtask of subtasks.documents) {
      await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, subtask.$id);
    }

    // Then delete the main task
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
    parentId: parentId,
    priority: "low",
    description: ""
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