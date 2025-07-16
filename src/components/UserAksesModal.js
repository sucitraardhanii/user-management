"use client";

import {
  Modal,
  Button,
  Autocomplete,
  Select,
  Switch,
  Group,
  Loader,
  Stack,
  Box,
  ThemeIcon,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconUserPlus, IconPlus } from "@tabler/icons-react";

import {
  fetchAllUserNippos,
  fetchAplikasi,
  encryptId,
  fetchHakAkses,
  createUserAkses,
} from "@/api/userAkses";

import { showNotification } from "@mantine/notifications";

export default function UserAksesModal({ opened, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingHakAkses, setLoadingHakAkses] = useState(false);

  const [userOptions, setUserOptions] = useState([]);
  const [allUserCache, setAllUserCache] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [debounced] = useDebouncedValue(userInput, 300);

  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [hakAksesOptions, setHakAksesOptions] = useState([]);

  const form = useForm({
    initialValues: {
      nippos: "",
      idaplikasi: "",
      idhakakses: "",
      statusUserAkses: true,
    },
    validate: {
      nippos: (value) => (value ? null : "NIPPOS tidak boleh kosong"),
      idhakakses: (value) => (value ? null : "Pilih hak akses"),
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingUser(true);
        const [apps, users] = await Promise.all([
          fetchAplikasi(),
          fetchAllUserNippos(),
        ]);
        setAplikasiOptions(apps);
        setAllUserCache(users);
      } catch (err) {
        console.error("Gagal fetch awal:", err);
      } finally {
        setLoading(false);
        setLoadingUser(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!debounced) {
      setUserOptions([]);
      return;
    }

    const filtered = allUserCache.filter((item) =>
      item.label.toLowerCase().includes(debounced.toLowerCase())
    );

    setUserOptions(filtered.slice(0, 20));
  }, [debounced, allUserCache]);

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
        console.error("Gagal fetch hak akses:", err);
        setHakAksesOptions([]);
      } finally {
        setLoadingHakAkses(false);
      }
    };

    fetchHakAksesFromApi();
  }, [form.values.idaplikasi]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createUserAkses({
        nippos: values.nippos,
        idHakAkses: parseInt(values.idhakakses),
        statusUserAkses: values.statusUserAkses ? 1 : 0,
      });

      showNotification({
        title: "Akses Berhasil Ditambahkan",
        message: `Akses untuk ${values.nippos} berhasil ditambahkan.`,
        color: "green",
        autoClose: 3000,
      });

      form.reset();
      setUserInput("");
      onClose?.();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Terjadi kesalahan.";
      showNotification({
        title: "Gagal",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      overlayProps={{ blur: 2 }}
      styles={{
        header: {
          marginTop: "-10px", // hilangkan jarak bawah header
          marginBottom: "5px", // tambahkan jarak bawah header
        },
      }}
      title={
        <Group spacing="xs" align="center">
          <ThemeIcon color="blue" variant="light" radius="xl" size="md">
            <IconPlus size={18} />
          </ThemeIcon>
          <Text fw={600} fz="xl">
            Tambah User Akses
          </Text>
        </Group>
      }
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)} p="sm">
        <Stack>
          <Autocomplete
            label="Cari NIPPOS / Email"
            placeholder="Ketik nippos, email, atau nama"
            data={userOptions.map((opt) => opt.label)}
            value={userInput}
            onChange={(val) => {
              setUserInput(val);
              const selected = userOptions.find((opt) => opt.label === val);
              form.setFieldValue("nippos", selected?.value || "");
            }}
            rightSection={loadingUser ? <Loader size="xs" /> : null}
            clearable
            disabled={loading}
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
              form.setFieldValue("idaplikasi", val);
              form.setFieldValue("idhakakses", "");
              setHakAksesOptions([]);
            }}
            rightSection={loading ? <Loader size="xs" /> : null}
          />

          <Select
            label="Pilih Hak Akses"
            data={hakAksesOptions}
            value={form.values.idhakakses}
            onChange={(val) => form.setFieldValue("idhakakses", val)}
            placeholder={loadingHakAkses ? "Memuat data..." : "Pilih hak akses"}
            searchable
            clearable
            required
            disabled={loading || !form.values.idaplikasi || loadingHakAkses}
            rightSection={loadingHakAkses ? <Loader size="xs" /> : null}
          />

          {hakAksesOptions.length === 0 &&
            !loadingHakAkses &&
            form.values.idaplikasi && (
              <Text size="xs" color="orange" mt="xs">
                ⚠️ Tidak ada hak akses yang tersedia untuk aplikasi ini.
              </Text>
            )}

          <Switch
            label={form.values.statusUserAkses ? "Aktif" : "Tidak Aktif"}
            checked={form.values.statusUserAkses}
            onChange={(event) =>
              form.setFieldValue("statusUserAkses", event.currentTarget.checked)
            }
          />
          <Group mt="md" position="right">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              leftSection={<IconUserPlus size={16} />}
              loading={loading}
              disabled={!form.values.nippos || !form.values.idhakakses}
            >
              Tambah Akses
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
}
