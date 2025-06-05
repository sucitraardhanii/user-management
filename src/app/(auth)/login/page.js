"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Card,
  Group,
  Checkbox,
  Anchor,
  Flex,
} from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("token", "dummy-token"); // Simpan token dummy
      router.push("/dashboard"); // Arahkan ke dashboard
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <Flex h="100vh" justify="center" align="center" p="lg"> 
    <Box withBorder shadow="md" maw="30vw" mx="auto" mt="lg">
      <Title order={2} mb="md" align="center">
        Login
      </Title>
      <Card withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <TextInput
            label="Email atau Nippos"
            placeholder="Masukkan email atau nippos"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            mb="sm"
          />
          <PasswordInput
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mb="sm"
          />
          <Group mt="md" justify="space-between">
            <Checkbox label="Remember me" />
            <Anchor size="sm" href="#">
              Forgot Password？
            </Anchor>
          </Group>
          <Button type="submit" color="#261FB3" fullWidth mt="xl">
            Login
          </Button>
        </form>
      </Card>
    </Box>
    </Flex>
  );
}
