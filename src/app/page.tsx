"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { toast, Toaster } from "react-hot-toast";
import { FiCheckSquare, FiClock, FiShield } from "react-icons/fi";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

function Home() {
  const router = useRouter();
  const loginModal = useDisclosure();
  const registerModal = useDisclosure();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", loginData, {
        withCredentials: true
      });
      document.cookie = `token=${response.data.token}; path=/`;
      toast.success("Login Successful!");
      router.push("/dashboard");
      loginModal.onClose();
    } catch (error: any) {
      console.log(error);
      toast.error("Login Failed");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("/api/register", {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      }, {
        withCredentials: true
      });
      toast.success("Registration successful! Please login.");
      registerModal.onClose();
      loginModal.onOpen();
      setRegisterData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <Toaster position="top-right" />

      <div className="text-center mb-8 md:mb-12 w-full max-w-2xl px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white">Welcome to TodoMaster</h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8">Organize your life, one task at a time</p>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8">
          <div className="flex flex-col items-center">
            <FiCheckSquare className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-gray-700 dark:text-gray-300" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Simple & Intuitive</p>
          </div>
          <div className="flex flex-col items-center">
            <FiClock className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-gray-700 dark:text-gray-300" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Save Time</p>
          </div>
          <div className="flex flex-col items-center">
            <FiShield className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-gray-700 dark:text-gray-300" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Secure & Private</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Join thousands of users who trust TodoMaster to keep their tasks organized and their goals on track.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <Button 
          className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800"
          onPress={loginModal.onOpen}
        >
          Login
        </Button>

        <Button 
          className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          variant="light"
          onPress={registerModal.onOpen}
        >
          Register
        </Button>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Login</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                  <Input
                    name="password"
                    label="Password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  variant="light" 
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button 
                  className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800"
                  onPress={handleLogin}
                >
                  Login
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={registerModal.isOpen}
        onOpenChange={registerModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Register</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    name="username"
                    label="Username"
                    type="text"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                  <Input
                    name="password"
                    label="Password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  variant="light" 
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button 
                  className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800"
                  onPress={handleRegister}
                >
                  Register
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

export default Home;
