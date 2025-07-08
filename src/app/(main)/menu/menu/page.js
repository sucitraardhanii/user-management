"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Select,
  Tabs,
  Card,
  Title,
  Container,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import GenericTable from "@/components/GenericTable";
import { fetchAplikasi, fetchHakAkses, getMenu } from "@/api/menu";
import { notifications } from "@mantine/notifications";

export default function MenuPage() {
  const [idAplikasi, setIdAplikasi] = useState(null);
  const [idHakAkses, setIdHakAkses] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [hakAksesOptions, setHakAksesOptions] = useState([]);

  const handleTampilkan = async () => {
    if (
      !idAplikasi ||
      !idHakAkses ||
      isNaN(Number(idAplikasi)) ||
      isNaN(Number(idHakAkses))
    ) {
      notifications.show({
        title: "Input tidak valid",
        message: "Silakan pilih Aplikasi dan Hak Akses yang sesuai",
        color: "orange",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await getMenu({
        idAplikasi: Number(idAplikasi),
        idHakAkses: Number(idHakAkses),
      });

      if (!res || res.length === 0) {
        notifications.show({
          title: "Tidak ada data",
          message: "Menu tidak ditemukan untuk kombinasi tersebut.",
          color: "yellow",
        });
      }

      setData(res);
    } catch (err) {
      if (err.message === "Data Tidak Ditemukan") {
        notifications.show({
          title: "Menu Kosong",
          message: "Tidak ada data menu untuk kombinasi tersebut.",
          color: "blue",
        });
      } else {
        notifications.show({
          title: "Gagal Menampilkan Menu",
          message: err.message,
          color: "red",
        });
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const apps = await fetchAplikasi();
      setAplikasiOptions(
        apps?.map((a) => ({
          value: String(a.idaplikasi),
          label: a.nama,
        })) || []
      );

      const akses = await fetchHakAkses();
      setHakAksesOptions(
        akses?.map((h) => ({
          value: String(h.idhakakses),
          label: `${h.namaAkses} (${h.namaAplikasi})`,
          app: h.namaAplikasi,
        })) || []
      );
    } catch (err) {
      console.error("Gagal ambil data filter:", err);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const columns = [
    { accessorKey: "alamatAkses", header: "Alamat Aplikasi" },
    { accessorKey: "idmenu", header: "ID Menu" },
    { accessorKey: "idParent", header: "ID Parent" },
    { accessorKey: "nama", header: "Nama Menu" },
    { accessorKey: "idaplikasi", header: "ID Aplikasi" },
    { accessorKey: "idhakakses", header: "ID Hak Akses" },
    { accessorKey: "layer", header: "Layer" },
    { accessorKey: "statusParent", header: "Status" },
  ];

  const filteredHakAkses = hakAksesOptions.filter((opt) => {
    if (!idAplikasi) return true;
    const selectedApp = aplikasiOptions.find((a) => a.value === idAplikasi);
    return selectedApp && opt.app === selectedApp.label;
  });

  return (
    <Container size="xl">
      <Title order={2} mb="md">
        Menu Management
      </Title>

      <Card withBorder p="md" radius="md" mb="lg">
        <Group align="flex-end" grow>
          <Select
            label="Pilih Aplikasi"
            data={aplikasiOptions}
            placeholder="Pilih aplikasi"
            value={idAplikasi}
            onChange={setIdAplikasi}
            searchable
            clearable
          />
          <Select
            label="Pilih Hak Akses"
            data={filteredHakAkses}
            placeholder="Pilih hak akses"
            value={idHakAkses}
            onChange={setIdHakAkses}
            searchable
            clearable
          />
          <Button variant="filled" onClick={handleTampilkan}>
            Tampilkan Data
          </Button>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button leftSection={<IconPlus size={18} />}>Buat Menu</Button>
        </Group>
      </Card>

      <Tabs defaultValue="menu">
        <Tabs.List>
          <Tabs.Tab value="menu">Daftar Menu</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="menu" pt="xs">
          <GenericTable
            data={data}
            columns={columns}
            loading={loading}
            searchable={false}
            exportable
            pagination
          />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
