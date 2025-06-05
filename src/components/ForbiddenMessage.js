"use client";

import { Button, Center, Stack, Text, Title, Paper, Image } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForbiddenMessage({ withRedirect = false }) {
  const router = useRouter();

  useEffect(() => {
    if (withRedirect) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [withRedirect]);

  return (
    <Center h="100vh" bg="gray.0">
      <Paper shadow="lg" radius="md" p="xl" withBorder w={420}>
        <Stack align="center" spacing="md">
          <Image
            src="https://illustrations.popsy.co/amber/digital-nomad.svg"
            alt="forbidden"
            width={180}
          />

          <Title order={2} ta="center" c="red.6">
            403 - Akses Ditolak
          </Title>

          <Text ta="center" c="dimmed">
            Kamu tidak punya izin untuk mengakses halaman ini.
            <br />
            Halaman ini hanya untuk pengguna tertentu.
          </Text>

          <Button component={Link} href="/login" fullWidth color="blue">
            Kembali ke Login
          </Button>

          {withRedirect && (
            <Text size="xs" ta="center" c="dimmed">
              Kamu akan dialihkan secara otomatis...
            </Text>
          )}
        </Stack>
      </Paper>
    </Center>
  );
}
