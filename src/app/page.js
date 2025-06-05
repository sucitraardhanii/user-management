"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Center, Stack, Text } from "@mantine/core";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const isValidToken = (t) => {
      return (
        typeof t === "string" &&
        t.trim() !== "" &&
        t !== "undefined" &&
        t !== "null" &&
        t.length > 20 // pastikan panjang minimal token JWT
      );
    };

    if (isValidToken(token)) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <Center h="100vh">
      <Stack align="center" spacing="xs">
        <Loader size="lg" color="#261FB3" />
        <Text size="sm" c="dimmed">
          Memuat halaman, mohon tunggu...
        </Text>
      </Stack>
    </Center>
  );
}
