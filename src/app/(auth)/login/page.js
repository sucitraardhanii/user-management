"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Title,
  Text,
  Flex,
  Stack,
  Image,
  TextInput,
  PasswordInput,
  Button,
  Paper,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { login, getToken } from "@/api/auth";
import { showNotification } from "@mantine/notifications";
import { IconUser, IconLock } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) router.replace("/dashboard");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/authMob`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nippos: username,
          password: password,
          idAplikasi: appId,
        }),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!contentType?.includes("application/json")) {
        const html = await res.text();
        console.error("Response bukan JSON:", html);
        throw new Error("Server mengirim data bukan JSON");
      }

      const data = await res.json();
      if (!data.token) throw new Error("Token tidak ditemukan");

      saveToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      showNotification({
        title: "Login Gagal",
        message: err.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      h="100vh"
      bg="#F7F7F7"
    >
      <Paper
        radius="lg"
        shadow="xl"
        style={{
          width: 800,
          height: 460,
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          w="50%"
          h="100%"
          sx={{ backgroundColor: "#f5f5f5" }}
          p="lg"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/img/login-ilustrasi.png"
            alt="Login Illustration"
            width={220}
            fit="contain"
          />
        </Box>

        {/* RIGHT SIDE */}
        <Box
          w="50%"
          p="xl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
                Lupa Password?
              </Anchor>
            </Group>
            <Button type="submit" color="#261FB3" fullWidth mt="xl">
              Login
            </Button>
          </form>
        </Box>
      </Paper>
    </Flex>
  );
}
