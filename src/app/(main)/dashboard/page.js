"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Card, Text, Title, Loader, Center } from "@mantine/core";
import { getToken } from "@/lib/auth";
import { fetchAplikasi, fetchUsers } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [appsData, usersData] = await Promise.all([
          fetchAplikasi(),
          fetchUsers(),
        ]);
        setApps(appsData);
        setUsers(usersData);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Center h="70vh">
        <Loader />
      </Center>
    );
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
