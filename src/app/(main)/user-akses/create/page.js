'use client';

import {
  Card,
  Text,
  TextInput,
  Button,
  Select,
  Switch,
  Title,
  Group,
  Loader,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { IconUserPlus } from '@tabler/icons-react';
import { searchUserByNippos } from '@/api/userAkses';
import { fetchAplikasi, encryptId, fetchHakAkses,createUserAkses } from "@/api/regisUserExtern";
import { showNotification } from '@mantine/notifications';
import { useRouter } from "next/navigation";

export default function AddUserAksesForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [hakAksesOptions, setHakAksesOptions] = useState([]);
  const [loadingHakAkses, setLoadingHakAkses] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
 
  const form = useForm({
    initialValues: {
      nippos: '',
      idaplikasi:'',
      idhakakses: '',
      statusUserAkses: true,
    },
    validate: {
      nippos: (value) => (value ? null : 'NIPPOS tidak boleh kosong'),
      idhakakses: (value) => (value ? null : 'Pilih hak akses'),
    },
  });

    useEffect(() => {
       const fetchInitialData = async () => {
         try {
           const [aplikasi] = await Promise.all([
             fetchAplikasi(),
           ]);
           setAplikasiOptions(aplikasi);
         } catch (err) {
           console.error("Gagal ambil data aplikasi:", err);
         } finally {
           setLoading(false);
         }
       };
   
       fetchInitialData();
     }, []);

     useEffect(() => {
      const selected = form.values.idaplikasi;
      if (!selected) return;

  const fetchHakAksesFromApi = async () => {
    setLoadingHakAkses(true);
    try {
      const encrypted = await encryptId(selected);
      const data = await fetchHakAkses(encrypted);
      setHakAksesOptions(data);
    } catch (err) {
      console.error("Gagal ambil hak akses:", err);
      setHakAksesOptions([]);
    } finally {
      setLoadingHakAkses(false);
    }
  };

  fetchHakAksesFromApi();
}, [form.values.idaplikasi]);
     
  const handleUserSearch = async (query) => {
    if (query.length < 3) return;
    const results = await searchUserByNippos(query);
    setUserOptions(results.map((user) => ({
      value: user.nippos,
      label: `${user.nippos} - ${user.nama}`,
    })));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createUserAkses({
        ...values,
        statusUserAkses: values.statusUserAkses ? 1 : 0,
      });

      showNotification({
        title: 'Berhasil',
        message: 'Akses berhasil ditambahkan!',
        color: 'green',
      });

      form.reset();
    } catch (err) {
      showNotification({
        title: 'Gagal',
        message: err.message || 'Terjadi kesalahan.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="md" p="lg" radius="md" withBorder>
      <Title order={4} mb="md">Tambah Akses User</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Cari NIPPOS / Email"
          placeholder="contoh: vega@email.com"
          onChange={(e) => {
            form.setFieldValue('nippos', e.currentTarget.value);
            handleUserSearch(e.currentTarget.value);
          }}
          value={form.values.nippos}
          data={userOptions}
          required
        />

        <Select
              label="Pilih Aplikasi"
              data={aplikasiOptions}
              placeholder="Pilih aplikasi"
              searchable
              clearable
              required
              disabled={loading}
              value={form.values.idaplikasi}
              onChange={(val) => {
                form.setFieldValue("idaplikasi", val);  // set aplikasi
                form.setFieldValue("idhakakses", "");   // reset hak akses
                setHakAksesOptions([]);                 // kosongkan list hak akses
              }}
              onClear={() => {
              form.setFieldValue("idaplikasi", "");
              form.setFieldValue("idhakakses", "");
              setHakAksesOptions([]);
            }}
              rightSection={loading ? <Loader size="xs" /> : null}
            />

            <Select
              label="Pilih Hak Akses"
              data={hakAksesOptions}
              value={form.values.idhakakses}
              onChange={(val) => form.setFieldValue('idhakakses', val)}
              placeholder={loadingHakAkses ? "Memuat data..." : "Pilih hak akses"}
              searchable
              clearable
              required
              disabled={loading || !form.values.idaplikasi || loadingHakAkses}
              rightSection={loadingHakAkses ? <Loader size="xs" /> : null}
            />

            {hakAksesOptions.length === 0 && !loadingHakAkses && form.values.idaplikasi && (
              <Text size="xs" color="orange" mt="xs">
                ⚠️ Tidak ada hak akses yang tersedia untuk aplikasi ini.
              </Text>
            )}

        <Switch
          label="Status Aktif"
          mt="md"
          checked={form.values.statusUserAkses}
          onChange={(event) =>
            form.setFieldValue('statusUserAkses', event.currentTarget.checked)
          }
        />

        <Group mt="xl">
          <Button
              type="submit"
              leftSection={<IconUserPlus />}
              loading={loading}
              disabled={hakAksesOptions.length === 0 || !form.values.idhakakses}
            >
              Tambah Akses
            </Button>
        </Group>
      </form>
    </Card>
  );
}
