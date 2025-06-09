"use client";

import { Grid, Card, Text, Title, Center, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveToken, getToken } from "@/lib/auth";
import ForbiddenMessage from "@/components/ForbiddenMessage";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState(undefined);
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = getToken();
    setToken(token);
  }, []);

  // ⏳ Loading sementara token dicek
  if (token === undefined) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  // 🔒 Jika belum login
  if (!token) {
    return <ForbiddenMessage />;
  }

  const totalApps = apps.length;
  const totalAdmins = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;
  const totalOtherRoles = users.filter(
    (user) => user.role?.toLowerCase() !== "admin"
  ).length;

  return (
    <>
      <Title order={2} mb="lg">
        Dashboard
      </Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={500}>
              Total Aplikasi
            </Text>
            <Text size="xl" color="blue" fw={700}>
              {apps.length}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={500}>
              Jumlah Admin
            </Text>
            <Text size="xl" color="green" fw={700}>
              {
                apps.filter((apps) => apps.name.toLowerCase() === "admin")
                  .length
              }
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={500}>
              Jumlah Role Lain
            </Text>
            <Text size="xl" color="red" fw={700}>
              {
                apps.filter((apps) => apps.name.toLowerCase() !== "admin")
                  .length
              }
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}
// users.length : jumlah total user
// filter(...==='admin') : jumlah user dengan role admin
// filter(...!=='admin') : jumlah user selain admin
