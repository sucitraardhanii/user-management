"use client";

import { Table, Paper, ScrollArea, Title, Group, Button } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import { Flex } from "@mantine/core";
// import { useEffect } from "react";

// [
//   { id: 1, name: "A", email: "aaa@gmail.com", role: "admin" },
//   { id: 2, name: "B", email: "bbb@gmail.com", role: "editor" },
//   { id: 3, name: "C", email: "ccc@gmail.com", role: "developer" },
// ]; // ini merupakan array user dummy yg bisa diganti dengan API nantinya

export default function AppPage() {
  // ini merupakan komponen halaman utama/users
  const apps = useAppStore((state) => state.apps);
  const fetchApps = useAppStore((state) => state.fetchApps);
  const deleteApp = useAppStore((state) => state.deleteApp);

  // useEffect(() => {
  //   fetchApps();
  // }, []);

  const rows = (apps || []).map((app) => (
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
  )); // ini artinya setiap user akan ditampilkan sebagai satu baris

  return (
    // ini merupakan return JSX yang akan digunakan pada bagian tampilan
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
// mb="md"artinya margin bawah ukuran medium
// paper : card putih dengan shadow ringan ("xs") padding medium ("md")
// ScrollArea : agar bisa digulir jika tabel melebar
// striped : baris bergaris warna selang-seling
// highlightOnHover : baris jadi terang kalau kursor diarahkan
// thead : judul kolom
// tbody : isi baris (hasil dari users.map)
// IconEdit : untuk edit
// IconTrash : untuk delete
