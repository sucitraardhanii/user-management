"use client";

import { useEffect } from "react";
import {
  Table,
  Paper,
  ScrollArea,
  Title,
  Group,
  Button,
  Flex,
  Loader,
  Center,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";

export default function AppPage() {
  const apps = useAppStore((state) => state.apps);
  const fetchApps = useAppStore((state) => state.fetchApps);
  const deleteApp = useAppStore((state) => state.deleteApp);
  const loading = apps.length === 0;

  useEffect(() => {
    fetchApps();
  }, []);

  const rows = apps.map((app) => (
    <tr key={app.id}>
      <td style={{ textAlign: "left" }}>{app.name}</td>
      <td style={{ textAlign: "left" }}>{app.address}</td>
      <td style={{ textAlign: "left" }}>{app.status}</td>
      <td style={{ whiteSpace: "nowrap" }}>
        <Flex gap="xs" wrap="nowrap">
          <Button
            size="xs"
            compact
            variant="light"
            color="blue"
            component={Link}
            href={`/apps/${app.id}/edit`}
            leftSection={<IconEdit size={14} />}
          >
            Edit
          </Button>
          <Button
            size="xs"
            variant="light"
            color="red"
            onClick={() => {
              if (confirm(`Yakin ingin menghapus ${app.name}?`)) {
                deleteApp(app.id);
              }
            }}
            leftSection={<IconTrash size={14} />}
          >
            Delete
          </Button>
        </Flex>
      </td>
    </tr>
  ));

  if (loading) {
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Title order={2} mb="md">
        Daftar Aplikasi
      </Title>
      <Button component={Link} href="/apps/create" mb="md">
        Tambah Aplikasi
      </Button>
      <Paper shadow="xs" p="md" withBorder>
        <ScrollArea>
          <Table striped highlightOnHover withColumnBorders>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Nama</th>
                <th style={{ textAlign: "left" }}>Alamat</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ width: "200px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </>
  );
}
