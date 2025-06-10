"use client";

import { Box, Flex } from "@mantine/core";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired, removeToken } from "@/api/auth";

export default function AppShell({ children }) {
  const [opened, setOpened] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        removeToken();
        router.push("/login");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex h="100vh">
      {opened && (
        <Box w={220} bg="white">
          <Sidebar />
        </Box>
      )}
      <Flex direction="column" style={{ flex: 1 }}>
        <Header
          sidebarOpened={opened}
          onToggleSidebar={() => setOpened((o) => !o)}
        />

        <Box p="md" style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
