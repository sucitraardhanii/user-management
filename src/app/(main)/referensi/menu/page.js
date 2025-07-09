'use client';

import { useEffect, useState } from 'react';
import { Select, Paper, Title, Stack, Button, Group, Loader, Flex } from '@mantine/core';
import GenericTable from '@/components/GenericTable';
import { fetchAplikasi, fetchHakAkses, fetchMenu, encryptId } from '@/api/menu';
import PageBreadCrumb from '@/components/PageBreadCrumb';

export default function MenuPage() {
  const [aplikasi, setAplikasi] = useState([]);
  const [idAplikasi, setIdAplikasi] = useState(null);
  const [hakAkses, setHakAkses] = useState([]);
  const [idHakAkses, setIdHakAkses] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApp, setLoadingApp] = useState(false);
  const [loadingHakAkses, setLoadingHakAkses] = useState(false);

  useEffect(() => {
    const loadAplikasi = async () => {
      try {
        setLoadingApp(true);
        const data = await fetchAplikasi();
        setAplikasi(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingApp(false);
      }
    };
    loadAplikasi();
  }, []);

  useEffect(() => {
    const loadHakAkses = async () => {
      if (!idAplikasi) return;
      try {
        setLoadingHakAkses(true);
        const encrypted = await encryptId(idAplikasi);
        const akses = await fetchHakAkses(encrypted);
        setHakAkses(akses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingHakAkses(false);
      }
    };

    if (idAplikasi) {
      loadHakAkses();
    } else {
      setHakAkses([]);
      setIdHakAkses(null);
    }
  }, [idAplikasi]);

  const handleSubmit = async () => {
    if (!idAplikasi || !idHakAkses) return;
    setLoading(true);
    try {
      const data = await fetchMenu({ idAplikasi, idHakAkses });
      setMenuData(data);
    } catch (err) {
      console.error('Gagal ambil menu:', err);
    }
    setLoading(false);
  };

  const columns = [
    { accessor: 'idmenu', header: 'ID Menu' },
    { accessor: 'nama', header: 'Nama Menu' },
    { accessor: 'alamatAkses', header: 'Akses' },
    { accessor: 'layer', header: 'Layer' },
    { accessor: 'idParent', header: 'Parent' },
    { accessor: 'statusParent', header: 'Status Parent' },
  ];

  return (
    <>
    <PageBreadCrumb/>
    <Flex justify="space-between" align="center" mb="md" mt="md">
        <Title order={2}>Manajemen Menu</Title>
    </Flex>
      <Stack>
        <Paper withBorder p="md" radius="md">
        <Flex gap="md" wrap="wrap">
            <Select
            label="Pilih Aplikasi"
            placeholder="Pilih aplikasi..."
            data={aplikasi}
            value={idAplikasi}
            onChange={setIdAplikasi}
            searchable
            clearable
            rightSection={loadingApp ? <Loader size={16} /> : null}
            style={{ flex: 1 }}
          />
          <Select
            label="Pilih Hak Akses"
            placeholder="Pilih hak akses..."
            data={hakAkses}
            value={idHakAkses}
            onChange={setIdHakAkses}
            searchable
            disabled={!hakAkses.length}
            rightSection={loadingHakAkses ? <Loader size={16} /> : null}
            style={{ flex: 1 }}
          />
           <Button color="#2E4070" onClick={handleSubmit} disabled={!idAplikasi || !idHakAkses} mt={20} style={{ height: "40px" }}>
              Tampilkan Data
            </Button>
        </Flex>
      </Paper>

      <GenericTable
        data={menuData}
        columns={columns}
        loading={loading}
        defaultPageSize={10}
      />
      </Stack>
    </>
  );
}
