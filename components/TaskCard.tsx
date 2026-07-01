import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Item, Task } from "../utils/task";


type TreeProps = {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, title: string) => Promise<void> | void;
  onSaveTaskTitle: (id: string, title: string) => Promise<void> | void;
  onSelectAddInput: (taskId: string | null) => void;
  activeAddInputTaskId: string | null;

  depth: number;

  // NEW
  number: string;
};

// type TreeProps = {
//   item: Item;
//   onToggle: (id: string) => void;
//   onDelete: (id: string) => void;
//   onAddChild: (parentId: string, title: string) => Promise<void> | void;
//   onSaveTaskTitle: (id: string, title: string) => Promise<void> | void;
//   onSelectAddInput: (taskId: string | null) => void;
//   activeAddInputTaskId: string | null;
//   depth: number;
// };



type FlatProps = {
  task: Task;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => Promise<void> | void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
};

type Props = TreeProps | FlatProps;



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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const addInputRef = useRef<TextInput | null>(null);

  const task = isTreeProps(props) ? props.item : props.task;
  const depth = isTreeProps(props) ? props.depth : 0;
  const number = isTreeProps(props) ? props.number : "";
  const onToggle = isTreeProps(props) ? props.onToggle : props.onToggleTask;
  const onDelete = isTreeProps(props) ? props.onDelete : props.onDeleteTask;
  const onAddChild = isTreeProps(props) ? props.onAddChild : props.onAddSubtask;
  const onSaveTaskTitle = isTreeProps(props) ? props.onSaveTaskTitle : undefined;
  const onSelectAddInput = isTreeProps(props) ? props.onSelectAddInput : undefined;
  const isActiveAddInput = isTreeProps(props) && props.activeAddInputTaskId === task.id;

  useEffect(() => {
    if (isActiveAddInput) {
      addInputRef.current?.focus();
    }
  }, [isActiveAddInput]);

  useEffect(() => {
    if (isEditing) {
      onSelectAddInput?.(null);
    }
  }, [isEditing, onSelectAddInput]);

  const handleToggleAddInput = () => {
    if (!onSelectAddInput) {
      return;
    }

    if (isActiveAddInput) {
      onSelectAddInput(null);
      setNewChildTitle("");
      return;
    }

    setIsEditing(false);
    setEditedTitle(task.title);
    onSelectAddInput(task.id);
  };

  const handleSaveNewChild = async () => {
    if (!newChildTitle.trim()) {
      Alert.alert("Error", "Subtask title cannot be empty.");
      return;
    }

    try {
      await onAddChild(task.id, newChildTitle.trim());
      setNewChildTitle("");
      onSelectAddInput?.(null);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add subtask.");
    }
  };

  const handleCancelNewChild = () => {
    setNewChildTitle("");
    onSelectAddInput?.(null);
  };

  const handleStartEditing = () => {
    if (isActiveAddInput) {
      onSelectAddInput?.(null);
    }

    setEditedTitle(task.title);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editedTitle.trim()) {
      Alert.alert("Error", "Task title cannot be empty.");
      return;
    }

    if (!onSaveTaskTitle) {
      return;
    }

    setIsSaving(true);

    try {
      await onSaveTaskTitle(task.id, editedTitle.trim());
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save task.");
    } finally {
      setIsSaving(false);
    }
  };

  const treeChildren = task.children ?? [];
  const subtasks = task.subtasks ?? [];
  const hasChildren = treeChildren.length > 0;

  const rowContent = (
    <View className="flex-row items-center">
      <Checkbox completed={task.completed} onPress={() => onToggle(task.id)} />

      {isEditing ? (
        <TextInput
          value={editedTitle}
          onChangeText={setEditedTitle}
          placeholder="Edit task title"
          placeholderTextColor="#9CA3AF"
          className="flex-1 rounded-xl bg-neutral-100 px-3 py-2 text-base text-foreground"
          style={{ color: "#111827" }}
        />
      ) : (

          <Text
            className={`flex-1 text-base ${
              task.completed
                ? "text-neutral-400 line-through"
                : "text-foreground"
            }`}
          >
            {number}. {task.title}
          </Text>
        // <Text
        //   className={`flex-1 text-base ${task.completed ? "text-neutral-400 line-through" : "text-foreground"}`}
        // >
        //   {task.title}
        // </Text>
      )}

      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={handleToggleAddInput} hitSlop={8}>
          <Feather name="plus" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStartEditing} hitSlop={8}>
          <Feather name="edit-2" size={16} color="#9CA3AF" />
        </TouchableOpacity>
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

  const editActions = isEditing ? (
    <View className="mx-4 mb-3 flex-row justify-end gap-3">
      <TouchableOpacity onPress={handleCancelEdit}>
        <Text className="text-sm font-medium text-neutral-500">Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSaveEdit}
        className="rounded-xl bg-black px-4 py-2.5"
        disabled={isSaving}
      >
        <Text className="text-sm font-semibold text-white">{isSaving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const addChildInput = isActiveAddInput ? (
    <View className="mx-4 mb-3 flex-row items-center rounded-2xl bg-neutral-100 px-3 py-2">
  <TextInput
    ref={addInputRef}
    placeholder="Add a subtask..."
    placeholderTextColor="#9CA3AF"
    value={newChildTitle}
    onChangeText={setNewChildTitle}
    className="flex-1 text-sm text-foreground"
    style={{ color: "#111827" }}
  />

  <TouchableOpacity
    onPress={handleSaveNewChild}
    className="ml-3 h-9 items-center justify-center rounded-full bg-black px-4"
  >
    <Text className="text-xs font-semibold text-white">
      Add
    </Text>
  </TouchableOpacity>
</View>
  ) : null;

  if (depth > 0) {
    return (
      <View className="mb-2">
        <View
          className="rounded-xl bg-neutral-100 px-3 py-3"
          style={{ marginLeft: depth * 16 }}
        >
          {rowContent}
        </View>

        {editActions}
        {addChildInput}

        {expanded && treeChildren.length > 0 && isTreeProps(props) && (
          <View className="mt-2 border-l border-neutral-200 pl-3" style={{ marginLeft: depth * 16 + 8 }}>

            {treeChildren.map((child, index) => (
              <TaskCard
                key={child.id}
                item={child}
                onToggle={onToggle}
                onDelete={onDelete}
                onAddChild={onAddChild}
                onSaveTaskTitle={props.onSaveTaskTitle}
                onSelectAddInput={props.onSelectAddInput}
                activeAddInputTaskId={props.activeAddInputTaskId}
                depth={depth + 1}

                number={`${number}.${index + 1}`}
              />
            ))}
            {/* {treeChildren.map((child) => (
              <TaskCard
                key={child.id}
                item={child}
                onToggle={onToggle}
                onDelete={onDelete}
                onAddChild={onAddChild}
                onSaveTaskTitle={props.onSaveTaskTitle}
                onSelectAddInput={props.onSelectAddInput}
                activeAddInputTaskId={props.activeAddInputTaskId}
                depth={depth + 1}
              /> 
            ))}
              */}
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      <View className="border-b border-neutral-100 px-4 py-4">{rowContent}</View>

      {editActions}
      {addChildInput}

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

      {expanded && treeChildren.length > 0 && isTreeProps(props) && (
        <View className="border-l border-neutral-200 px-4 pb-2 pl-6">

        {treeChildren.map((child, index) => (
          <TaskCard
            key={child.id}
            item={child}
            onToggle={onToggle}
            onDelete={onDelete}
            onAddChild={onAddChild}
            onSaveTaskTitle={props.onSaveTaskTitle}
            onSelectAddInput={props.onSelectAddInput}
            activeAddInputTaskId={props.activeAddInputTaskId}
            depth={depth + 1}

            number={`${number}.${index + 1}`}
          />
           ))}

          {/* {treeChildren.map((child) => (
            <TaskCard
              key={child.id}
              item={child}
              onToggle={onToggle}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onSaveTaskTitle={props.onSaveTaskTitle}
              onSelectAddInput={props.onSelectAddInput}
              activeAddInputTaskId={props.activeAddInputTaskId}
              depth={depth + 1}
            />
          ))} */}
        </View>
      )}
    </View>
  );
}
