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
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Todo {
  id?: number;
  title: string;
  content: string;
  isCompleted: boolean;
}

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
    const token = window.localStorage.getItem("token");
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/todo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data);
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
      const token = window.localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/todo",
        newTodo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodos([...todos, response.data]);
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
      const token = window.localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/todo/${todoId}`,
        { isCompleted: !isCompleted },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodos(
        todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, isCompleted: !isCompleted }
            : todo
        )
      );
      toast.success("Todo status updated");
    } catch (error: any) {
      toast.error("Failed to update todo status");
      console.log(error);
    }
  };

  const handleEditTodo = async () => {
    if (!editingTodo || !editingTodo.title.trim() || !editingTodo.content.trim()) return;

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/todo",
        {
          id: editingTodo.id,
          title: editingTodo.title,
          content: editingTodo.content,
          isCompleted: editingTodo.isCompleted,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id ? response.data : todo
        )
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
      const token = window.localStorage.getItem("token");
      await axios.delete("http://localhost:3000/api/todo", {
        headers: { Authorization: `Bearer ${token}` },
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
    window.localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Todo List</h1>
          <div className="flex gap-3">
            <Button color="primary" onPress={addTodoModal.onOpen}>
              Add New Todo
            </Button>
            <Button 
              color="danger" 
              variant="light" 
              onPress={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggleComplete(todo.id!, todo.isCompleted)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium text-gray-800 mb-1 ${todo.isCompleted ? 'line-through text-gray-500' : ''
                        }`}
                    >
                      {todo.title}
                    </h3>
                    <p
                      className={`text-gray-600 ${todo.isCompleted ? 'line-through text-gray-400' : ''
                        }`}
                    >
                      {todo.content}
                    </p>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm">
                        <FiMoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key={`edit-${todo.id}`}
                        startContent={<FiEdit2 className="h-4 w-4" />}
                        onPress={() => {
                          setEditingTodo(todo);
                          editTodoModal.onOpen();
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        key={`delete-${todo.id}`}
                        startContent={<FiTrash2 className="h-4 w-4" />}
                        className="text-danger"
                        onPress={() => handleDeleteTodo(todo.id!)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${todo.isCompleted
                    ? 'text-green-600'
                    : 'text-yellow-600'
                    }`}>
                    {todo.isCompleted ? 'Completed' : 'Pending'}
                  </span>
                  <div className="flex gap-2">
                    {/* Add more actions here if needed */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Todo Modal */}
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
                        setNewTodo((prev) => ({ ...prev, title: e.target.value }))
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
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleAddTodo}>
                    Add Todo
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Edit Todo Modal */}
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
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleEditTodo}>
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
