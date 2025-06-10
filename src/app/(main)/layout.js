"use client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import AppShell from "@/components/AppShell";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from '@mantine/modals';

export default function MainLayout({ children }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
      <Notifications position="top-center" /> 
      <AppShell>{children}</AppShell></ModalsProvider>
    </MantineProvider>
  );
}
