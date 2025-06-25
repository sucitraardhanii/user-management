"use client";

import { useState, useMemo } from "react";
import {
  TextInput,
  Button,
  Paper,
  Flex,
  Stack,
  Title,
  Center,
} from "@mantine/core";
import GenericTable from "@/components/GenericTable";
import { fetchUserAkses } from "@/api/userAkses";
import StatusBadge from "@/components/StatusBadge";
import NullBadge from "@/components/NullBadge";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Breadcrumb from "@/components/BreadCrumb";
import CreateButton from "@/components/CreateButton";

export default function UserAksesPage() {
  const [nippos, setNippos] = useState("");
  const [idApp, setIdApp] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    const result = await fetchUserAkses({ nippos, idAplikasi: idApp });
    setData(result);
    setLoading(false);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "alamataplikasi", header: "Alamat", Cell: ({ cell }) => <NullBadge value={cell.getValue()} />,},
      { accessorKey: "idAkses", header: "ID Akses", size: 100 },
      { accessorKey: "idHakAkses", header: "ID Hak Akses", size: 100},
      { accessorKey: "namaAkses", header: "Nama Akses", size: 150},
      { accessorKey: "namaAplikasi", header: "Nama Aplikasi" },
      { accessorKey: "nippos", header: "Nippos", size: 150 },
      {
        accessorKey: "statusUserAkses",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => <StatusBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
        header: "Aksi",
        Cell: ({ row }) => (
          <Flex gap="xs" wrap="nowrap">
            <Button
              size="xs"
              variant="light"
              color="blue"
              component={Link}
              href={`/user-akses/${row.original.id}/edit`}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => handleDelete(row.original.id, row.original.name)}
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Flex justify="space-between" align="center" mb="md" mt="md">
              <Title order={2}>User</Title>
              <CreateButton entity="user" />
            </Flex>
      <Breadcrumb />
      <Stack>
        {/* Form Filter */}
        <Paper withBorder p="md" radius="md">
          <Flex gap="md" wrap="wrap">
            <TextInput
              label="Nippos"
              value={nippos}
              onChange={(e) => setNippos(e.target.value)}
              placeholder="Masukkan Nippos"
              style={{ flex: 1 }}
            />
            <TextInput
              label="ID Aplikasi"
              value={idApp}
              onChange={(e) => setIdApp(e.target.value)}
              placeholder="Masukkan ID Aplikasi"
              style={{ flex: 1 }}
            />
            <Button onClick={handleFetch} mt={20} style={{ height: "40px" }}>
              Tampilkan Data
            </Button>
          </Flex>
        </Paper>

        <GenericTable data={data} columns={columns} loading={loading} />
      </Stack>
    </>
  );
}
