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
import { showNotification } from "@mantine/notifications";
import { IconUser, IconLock } from "@tabler/icons-react";
import { login, getToken } from "@/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [idaplikasi, setIdAplikasi] = useState("");
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
      await login({ nippos: username, password, idaplikasi});
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
    }finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      h="100vh"
      bg="#1C2D5A"
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
            src="/img/icon-login.png"
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
              <TextInput
                icon={<IconUser size={16} />}
                placeholder="ID Aplikasi"
                value={idaplikasi}
                onChange={(e) => setIdAplikasi(e.target.value)}
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