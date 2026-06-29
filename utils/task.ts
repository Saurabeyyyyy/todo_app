export type Priority = "low" | "medium" | "high";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority;
  description?: string;
  subtasks?: SubTask[];
  children?: Task[];
}

export type Item = Task;