"use client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Notifications } from "@mantine/notifications";
import { getToken } from "@/api/auth";
import ForbiddenPage from "@/app/forbidden/page";
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

export default function MainLayout({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const token = getToken();
    setAuthorized(!!token);
  }, []);

  if (authorized === null) {
    return null; // atau bisa tampilkan <Loading />
  }

  if (!authorized) {
    return <ForbiddenPage />;
  }
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
      <Notifications position="top-center" /> 
      <AppShell>{children}</AppShell></ModalsProvider>
    </MantineProvider>
  );
}
