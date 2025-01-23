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
      const response = await axios.post("/api/login", loginData);
      window.localStorage.setItem("token", response.data.token);
      toast.success("Login Successful!");
      router.push("/dashboard");
      loginModal.onClose();
      // Add navigation logic here
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
    <section className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Toaster position="top-right" />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to TodoMaster</h1>
        <p className="text-gray-600">Organize your life, one task at a time</p>
      </div>

      <div className="flex gap-4">
        <Button color="primary" onPress={loginModal.onOpen}>
          Login
        </Button>

        <Button color="secondary" onPress={registerModal.onOpen}>
          Register
        </Button>

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
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleLogin}>
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
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleRegister}>
                    Register
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

export default Home;
