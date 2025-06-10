"use client";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import AppShell from "@/components/AppShell";
import { Notifications } from "@mantine/notifications";

export default function MainLayout({ children }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-center" /> 
      <AppShell>{children}</AppShell>
    </MantineProvider>
  );
}
