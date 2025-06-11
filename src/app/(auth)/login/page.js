"use client";

import { useEffect, useState } from "react";
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
import { login, getToken } from "@/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ nippos: username, password });
      router.push("/dashboard");
    } catch (err) {
      alert("Login gagal: " + err.message);
      console.error("LOGIN ERROR:", err);
    }
  };

  return (
    <Flex h="100vh" justify="center" align="center" p="lg">
      <Box>
        <Title order={1} mb="md" align="center">
          Login
        </Title>
        <Card withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleLogin}>
            <TextInput
              label="Email atau Nippos"
              placeholder="Masukkan email atau nippos"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
              mb="sm"
            />
            <PasswordInput
              label="Password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
              mb="sm"
            />
            <Group mt="md" justify="space-between">
              <Checkbox label="Remember me" />
              <Anchor size="sm" href="#">
                Lupa Password?
              </Anchor>
            </Group>
            <Button type="submit" color="#261FB3" fullWidth mt="xl" loading={loading}>
              Login
            </Button>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
