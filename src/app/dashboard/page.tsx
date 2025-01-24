"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiList,
  FiCheckCircle,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Todo {
  id?: number;
  title: string;
  content: string;
  isCompleted: boolean;
}

// Update the axios instance to include the token from cookie in headers
const getToken = () => {
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="));
  return cookie ? cookie.split("=")[1] : null;
};

// Create an axios instance with default config
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://todo-app-tau-gilt-98.vercel.app" // Replace with your production API URL
      : "http://localhost:3000",
  withCredentials: true,
});

// Add request interceptor to add token to headers
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({
    title: "",
    content: "",
    isCompleted: false,
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const addTodoModal = useDisclosure();
  const editTodoModal = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get("/api/todo");
        setTodos(response.data.reverse());
      } catch (error: any) {
        toast.error("Failed to fetch todos");
        console.log(error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.title.trim() || !newTodo.content.trim()) return;

    try {
      const response = await api.post("/api/todo", newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: "", content: "", isCompleted: false });
      toast.success("Todo added successfully");
      addTodoModal.onClose();
    } catch (error: any) {
      toast.error("Failed to add todo");
      console.log(error);
    }
  };

  const handleToggleComplete = async (todoId: number, isCompleted: boolean) => {
    try {
      await api.put("/api/todo", {
        id: todoId,
        isCompleted: !isCompleted,
      });

      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, isCompleted: !isCompleted } : todo
        )
      );
      toast.success("Todo status updated");
    } catch (error: any) {
      toast.error("Failed to update todo status");
      console.log(error);
    }
  };

  const handleEditTodo = async () => {
    if (
      !editingTodo ||
      !editingTodo.title.trim() ||
      !editingTodo.content.trim()
    )
      return;

    try {
      const response = await api.put("/api/todo", {
        id: editingTodo.id,
        title: editingTodo.title,
        content: editingTodo.content,
        isCompleted: editingTodo.isCompleted,
      });

      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? response.data : todo))
      );
      toast.success("Todo updated successfully");
      editTodoModal.onClose();
      setEditingTodo(null);
    } catch (error: any) {
      toast.error("Failed to update todo");
      console.log(error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await api.delete("/api/todo", {
        data: { id: todoId },
      });

      setTodos(todos.filter((todo) => todo.id !== todoId));
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete todo");
      console.log(error);
    }
  };

  const handleLogout = () => {
    // Remove token from cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-16 sm:mt-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiList className="w-6 h-6" />
              My Todo List
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Keep track of your tasks and stay organized
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800 gap-2"
              onPress={addTodoModal.onOpen}
            >
              <FiPlus className="w-4 h-4" />
              Add New Todo
            </Button>
            <Button
              className="flex-1 sm:flex-none border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              variant="light"
              onPress={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <FiList className="w-4 h-4" />
              <span className="text-xs font-medium">Total Tasks</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {todos.length}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <FiCheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {todos.filter((todo) => todo.isCompleted).length}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <FiClock className="w-4 h-4" />
              <span className="text-xs font-medium">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {todos.filter((todo) => !todo.isCompleted).length}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <FiList className="w-4 h-4" />
              <span className="text-xs font-medium">Completion Rate</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {todos.length
                ? Math.round(
                    (todos.filter((todo) => todo.isCompleted).length /
                      todos.length) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Tasks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {todos.length} {todos.length === 1 ? "task" : "tasks"} total
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700/50 hover:shadow-sm transition-all"
            >
              <div className="p-3 md:p-4">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() =>
                        handleToggleComplete(todo.id!, todo.isCompleted)
                      }
                      className="w-4 h-4 rounded-sm border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 truncate ${
                        todo.isCompleted
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : ""
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <p
                      className={`text-xs text-gray-600 dark:text-gray-300 line-clamp-2 ${
                        todo.isCompleted
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : ""
                      }`}
                    >
                      {todo.content}
                    </p>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 min-w-unit-8 w-8 h-8"
                      >
                        <FiMoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key={`edit-${todo.id}`}
                        startContent={<FiEdit2 className="h-3.5 w-3.5" />}
                        onPress={() => {
                          setEditingTodo(todo);
                          editTodoModal.onOpen();
                        }}
                        className="text-sm"
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        key={`delete-${todo.id}`}
                        startContent={<FiTrash2 className="h-3.5 w-3.5" />}
                        className="text-sm text-gray-700 dark:text-gray-300"
                        onPress={() => handleDeleteTodo(todo.id!)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <span
                  className={`text-xs font-medium ${
                    todo.isCompleted
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {todo.isCompleted ? "Completed" : "In Progress"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={addTodoModal.isOpen}
          onOpenChange={addTodoModal.onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Add New Todo</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      value={newTodo.title}
                      onChange={(e) =>
                        setNewTodo((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter todo title"
                    />
                    <Input
                      label="Content"
                      value={newTodo.content}
                      onChange={(e) =>
                        setNewTodo((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Enter todo description"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800"
                    onPress={handleAddTodo}
                  >
                    Add Todo
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={editTodoModal.isOpen}
          onOpenChange={editTodoModal.onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Edit Todo</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      value={editingTodo?.title || ""}
                      onChange={(e) =>
                        setEditingTodo((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        )
                      }
                      placeholder="Enter todo title"
                    />
                    <Input
                      label="Content"
                      value={editingTodo?.content || ""}
                      onChange={(e) =>
                        setEditingTodo((prev) =>
                          prev ? { ...prev, content: e.target.value } : null
                        )
                      }
                      placeholder="Enter todo description"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800"
                    onPress={handleEditTodo}
                  >
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </section>
  );
}

export default Page;
