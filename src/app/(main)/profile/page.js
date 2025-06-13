"use client";

import { useEffect, useState } from "react";
import { Title, Text, Card, Stack, Center, Loader } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { getToken } from "@/api/auth";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data profile");
        return res.json();
      })
      .then(setUser)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );
  }

  if (!user) {
    return <Text> Gagal memuat data</Text>;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Title order={2}> Profile </Title>
        <Text>
          <strong>Nama: </strong> {user.name}{" "}
        </Text>
        <Text>
          <strong>Nippos: </strong> {user.nippos}{" "}
        </Text>
      </Stack>
    </Card>
  );
}
