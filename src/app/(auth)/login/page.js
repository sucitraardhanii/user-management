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
import { saveToken, getToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;

  // ⛔ Jika sudah login, langsung redirect ke /dashboard
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/dashboard");
    }
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
      alert("Login gagal: " + err.message);
      console.error("LOGIN ERROR:", err);
    }
  };

  return (
    <Flex h="100vh" justify="center" align="center" p="lg">
      <Box shadow="md" maw="30vw" mx="auto" mt="lg" style={{ border: "1px solid #ccc" }}>
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
                Lupa Password?
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
