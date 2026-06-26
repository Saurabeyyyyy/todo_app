import { Task } from "./task";

export const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    completed: false,
    priority: "high",
    subtasks: [
      {
        id: "1",
        title: "Draft executive summary",
        completed: true,
      },
      {
        id: "2",
        title: "Add budget breakdown",
        completed: false,
      },
    ],
  },

  {
    id: "2",
    title: "Buy groceries",
    completed: false,
    priority: "medium",
    subtasks: [
      {
        id: "1",
        title: "Milk",
        completed: true,
      },
      {
        id: "2",
        title: "Bread",
        completed: false,
      },
      {
        id: "3",
        title: "Eggs",
        completed: false,
      },
    ],
  },

  {
    id: "3",
    title: "Schedule team meeting",
    completed: true,
    priority: "low",
    subtasks: [],
  },
];