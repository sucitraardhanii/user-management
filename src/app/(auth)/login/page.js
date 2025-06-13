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
import { saveToken, getToken } from "@/api/auth";
import { showNotification } from "@mantine/notifications";
import { IconUser, IconLock } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const appId = process.env.NEXT_PUBLIC_APP_ID;

  useEffect(() => {
    const token = getToken();
    if (token) router.replace("/dashboard");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/authMob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nippos: username, password, idAplikasi: appId }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!contentType?.includes("application/json")) {
        const html = await res.text();
        throw new Error("Server mengirim data bukan JSON");
      }

      const data = await res.json();
      if (!data.token) throw new Error("Token tidak ditemukan");

      saveToken(data.token);
      showNotification({
        title: "Berhasil Login",
        message: "Selamat Datang",
        color: "green",
      });
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
            <Stack justify="center" h="100%" gap="md">
              <div>
                <Title order={2} mb={2}>
                  User Management
                </Title>
                <Text size="sm" c="dimmed">
                  Login 
                </Text>
              </div>

              <TextInput
                icon={<IconUser size={16} />}
                placeholder="Email / Nippos"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
              <PasswordInput
                icon={<IconLock size={16} />}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <Button type="submit" fullWidth loading={loading} radius="xs" color="#0118D8">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Flex>
  );
}