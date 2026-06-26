import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Item, Task } from "../utils/task";

type TreeProps = {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, title: string) => void;
  depth: number;
};

type FlatProps = {
  task: Task;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
};

type Props = TreeProps | FlatProps;

const MAX_DEPTH = 6;

function isTreeProps(props: Props): props is TreeProps {
  return "item" in props;
}

function Checkbox({ completed, onPress }: { completed: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="mr-3">
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
          completed ? "border-black bg-black" : "border-neutral-300 bg-white"
        }`}
      >
        {completed && <Feather name="check" size={12} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
}

export default function TaskCard(props: Props) {
  const [newChildTitle, setNewChildTitle] = useState("");
  const [expanded, setExpanded] = useState(true);

  const task = isTreeProps(props) ? props.item : props.task;
  const depth = isTreeProps(props) ? props.depth : 0;
  const onToggle = isTreeProps(props) ? props.onToggle : props.onToggleTask;
  const onDelete = isTreeProps(props) ? props.onDelete : props.onDeleteTask;
  const onAddChild = isTreeProps(props) ? props.onAddChild : props.onAddSubtask;

  const treeChildren = task.children ?? [];
  const subtasks = task.subtasks ?? [];
  const hasChildren = treeChildren.length > 0;

  const handleAddChild = () => {
    if (newChildTitle.trim()) {
      onAddChild(task.id, newChildTitle.trim());
      setNewChildTitle("");
    }
  };

  const rowContent = (
    <View className="flex-row items-center">
      <Checkbox completed={task.completed} onPress={() => onToggle(task.id)} />

      <Text
        className={`flex-1 text-base ${task.completed ? "text-neutral-400 line-through" : "text-foreground"}`}
      >
        {task.title}
      </Text>

      <View className="flex-row items-center gap-3">
        <Feather name="plus" size={16} color="#9CA3AF" />
        <Feather name="edit-2" size={16} color="#9CA3AF" />
        <TouchableOpacity onPress={() => onDelete(task.id)} hitSlop={8}>
          <Feather name="trash-2" size={16} color="#F87171" />
        </TouchableOpacity>
        {hasChildren && (
          <TouchableOpacity onPress={() => setExpanded((prev) => !prev)} hitSlop={8}>
            <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (depth > 0) {
    return (
      <View className="mb-2">
        <View
          className="rounded-xl bg-neutral-100 px-3 py-3"
          style={{ marginLeft: depth * 16 }}
        >
          {rowContent}
        </View>

        {expanded && treeChildren.length > 0 && (
          <View className="mt-2 border-l border-neutral-200 pl-3" style={{ marginLeft: depth * 16 + 8 }}>
            {treeChildren.map((child) => (
              <TaskCard
                key={child.id}
                item={child}
                onToggle={onToggle}
                onDelete={onDelete}
                onAddChild={onAddChild}
                depth={depth + 1}
              />
            ))}
          </View>
        )}

        {isTreeProps(props) && depth < MAX_DEPTH && (
          <View
            className="mt-2 flex-row items-center rounded-xl bg-neutral-100 px-3 py-2"
            style={{ marginLeft: depth * 16 }}
          >
            <TextInput
              placeholder={depth > 1 ? "Add nested subtask..." : "Add a subtask..."}
              placeholderTextColor="#9CA3AF"
              value={newChildTitle}
              onChangeText={setNewChildTitle}
              className="mr-2 flex-1 text-sm text-foreground"
              style={{ color: "#111827" }}
            />
            <TouchableOpacity onPress={handleAddChild} className="rounded-lg bg-black px-3 py-1.5">
              <Text className="text-xs font-semibold text-white">Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      <View className="border-b border-neutral-100 px-4 py-4">{rowContent}</View>

      {subtasks.length > 0 && (
        <View className="px-4 py-2">
          {subtasks.map((subtask) => (
            <View
              key={subtask.id}
              className="mb-2 flex-row items-center justify-between rounded-xl bg-neutral-100 px-3 py-2"
            >
              <Text className={subtask.completed ? "text-neutral-400 line-through" : "text-neutral-700"}>
                {subtask.title}
              </Text>
              {isTreeProps(props) ? null : (
                <View className="flex-row items-center gap-3">
                  {props.onToggleSubtask && (
                    <TouchableOpacity onPress={() => props.onToggleSubtask?.(task.id, subtask.id)}>
                      <Feather
                        name="check-circle"
                        size={18}
                        color={subtask.completed ? "#16a34a" : "#9ca3af"}
                      />
                    </TouchableOpacity>
                  )}
                  {props.onDeleteSubtask && (
                    <TouchableOpacity onPress={() => props.onDeleteSubtask?.(task.id, subtask.id)}>
                      <Feather name="x" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {expanded && treeChildren.length > 0 && (
        <View className="border-l border-neutral-200 px-4 pb-2 pl-6">
          {treeChildren.map((child) => (
            <TaskCard
              key={child.id}
              item={child}
              onToggle={onToggle}
              onDelete={onDelete}
              onAddChild={onAddChild}
              depth={depth + 1}
            />
          ))}
        </View>
      )}

      {isTreeProps(props) && depth < MAX_DEPTH && (
        <View className="mx-4 mb-3 flex-row items-center rounded-xl bg-neutral-100 px-3 py-2">
          <TextInput
            placeholder="Add a subtask..."
            placeholderTextColor="#9CA3AF"
            value={newChildTitle}
            onChangeText={setNewChildTitle}
            className="mr-2 flex-1 text-sm text-foreground"
            style={{ color: "#111827" }}
          />
          <TouchableOpacity onPress={handleAddChild} className="rounded-lg bg-black px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
