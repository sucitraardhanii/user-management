"use client";

import { useEffect, useState } from "react";
import { Grid, Card, Text, Title } from "@mantine/core";
import { fetchAplikasi } from "@/api/api";
import Link from "next/link";

export default function DashboardPage() {
  const [totalAplikasi, setTotalAplikasi] = useState(0);

  useEffect(() => {
    fetchAplikasi()
      .then((data) => {
        setTotalAplikasi(data.length);
      })
      .catch((err) => {
        console.error("Gagal ambil data aplikasi:", err);
      });
  }, []);

  return (
    <>
      <Title order={2} mb="lg">
        Dashboard
      </Title>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Link href="/apps" style={{ textDecoration: "none" }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: "pointer" }}
            >
              <Text size="lg" fw={500}>
                Total Aplikasi
              </Text>
              <Text size="xl" color="blue" fw={700}>
                {totalAplikasi}
              </Text>
            </Card>
          </Link>
        </Grid.Col>

        {/* Tambahkan kartu lainnya di sini */}
      </Grid>
    </>
  );
}
