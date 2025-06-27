"use client";

import {
  Card,
  Text,
  Autocomplete,
  Select,
  Switch,
  Title,
  Group,
  Loader,
  Button,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconUserPlus } from "@tabler/icons-react";
import { fetchAllUserNippos } from "@/api/userAkses";
import {
  fetchAplikasi,
  encryptId,
  fetchHakAkses,
  createUserAkses,
} from "@/api/userAkses";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function AddUserAksesForm() {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingHakAkses, setLoadingHakAkses] = useState(false);

  const [userOptions, setUserOptions] = useState([]);
  const [allUserCache, setAllUserCache] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [debounced] = useDebouncedValue(userInput, 300);

  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [hakAksesOptions, setHakAksesOptions] = useState([]);
  const route = useRouter();

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

  const uniqueByValue = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.value)) return false;
      seen.add(item.value);
      return true;
    });
  };

  // Ambil data awal
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

  // Filter lokal dari cache
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

  // Ambil hak akses saat aplikasi dipilih
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
      const encryptedId = await encryptId(values.idaplikasi);

      await createUserAkses({
        nippos: values.nippos,
        idHakAkses: parseInt(values.idhakakses),
        statusUserAkses: values.statusUserAkses ? 1 : 0,
      });

      showNotification({
        title: "Akses Berhasil Ditambahkan",
        message: (
          <>
            <div>
              <strong>📩Email:</strong> {values.nippos}
            </div>
            <div>
              <strong>🔐Encrypted ID:</strong> {encryptedId}
            </div>
          </>
        ),
        color: "green",
        autoClose: 3000,
      });

      form.reset();
      setUserInput("");
      route.push("/user-akses");
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
    <Card shadow="md" p="lg" radius="md" withBorder>
      <Title order={4} mb="md">
        Tambah Akses User
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
          label="Status Aktif"
          mt="md"
          checked={form.values.statusUserAkses}
          onChange={(event) =>
            form.setFieldValue("statusUserAkses", event.currentTarget.checked)
          }
        />

        <Group mt="xl">
          <Button
            type="submit"
            leftSection={<IconUserPlus />}
            loading={loading}
            disabled={!form.values.nippos || !form.values.idhakakses}
          >
            Tambah Akses
          </Button>
        </Group>
      </form>
    </Card>
  );
}
