
"use client";

import { useState, useEffect } from 'react';
import { Stepper, Button, Group, TextInput, PasswordInput, Code,
  Card,
  Title,
  Select,
  Autocomplete, Loader 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import Breadcrumb from "@/components/BreadCrumb";
import { fetchJabatan, searchKantor, fetchAllKantor } from "@/api/menu";

export default function RegistrasiUser() {
  const [active, setActive] = useState(0);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [kantorOptions, setKantorOptions] = useState([]);
  const [allKantorCache, setAllKantorCache] = useState([]);
  const [kantorInput, setKantorInput] = useState("");
  const [debounced] = useDebouncedValue(kantorInput, 300);
  const [loading, setLoading] = useState(true);
  const [loadingKantor, setLoadingKantor] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      nippos: '',
      email: '',
      nama: '',
      codeJabatan: '',
      kantor: '',
      statuspegawai: '',
      statusakun: '',
      password: '',
    },
    validate: (values) => {
      if (active === 0) {
        return {
          nippos: values.nippos.trim().length < 6 ? 'Nippos minimal 6 karakter' : null,
          password: values.password.length < 6 ? 'Password minimal 6 karakter' : null,
        };
      }

      if (active === 1) {
        return {
          nama: values.nama.trim().length < 2 ? 'Nama minimal 2 karakter' : null,
          email: /^\S+@\S+$/.test(values.email) ? null : 'Format email tidak valid',
        };
      }

      return {};
    },
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jabatan, semuaKantor] = await Promise.all([
          fetchJabatan(),
          fetchAllKantor()
        ]);
        setJabatanOptions(jabatan);
        setAllKantorCache(semuaKantor);
      } catch (err) {
        console.error("Gagal ambil jabatan/kantor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueByValue = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
};

useEffect(() => {
  const doSearch = async () => {
    if (!debounced) return;

    if (/^\\d+$/.test(debounced)) {
      setLoadingKantor(true);
      try {
        const result = await searchKantor(debounced);
        setKantorOptions(uniqueByValue(result));
      } catch (err) {
        console.error("Gagal search kantor:", err);
      } finally {
        setLoadingKantor(false);
      }
    } else {
      const filtered = allKantorCache.filter((item) =>
        item.label.toLowerCase().includes(debounced.toLowerCase())
      );
      setKantorOptions(uniqueByValue(filtered));
    }
  };

  doSearch();
}, [debounced]);

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Title order={3} mb="md">Registrasi User</Title>
      <Breadcrumb />

      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stepper active={active}>
          <Stepper.Step label="First step" description="Data User">
            <TextInput
              label="Nippos"
              placeholder="Nippos"
              key={form.key('nippos')}
              {...form.getInputProps('nippos')}
              required
            />
            <TextInput
              label="Email"
              placeholder="Email"
              key={form.key('email')}
              {...form.getInputProps('email')}
              required
            />
            <TextInput
              label="Nama"
              placeholder="Nama"
              key={form.key('nama')}
              {...form.getInputProps('nama')}
              required
            />

            <Select
              label="Pilih Jabatan"
              placeholder={loading ? "Loading..." : "Pilih jabatan"}
              data={jabatanOptions}
              key={form.key('codeJabatan')}
              {...form.getInputProps('codeJabatan')}
              searchable
              clearable
              disabled={loading}
              required
              mt="md"
            />

            <Autocomplete
            label="Pilih Kantor"
            placeholder="Ketik NOPEND atau Nama Kantor"
            data={kantorOptions.map((opt) => opt.label)}
            value={kantorInput}
            onChange={(val) => {
                setKantorInput(val);
                const selected = kantorOptions.find((opt) => opt.label === val);
                form.setFieldValue("kantor", selected?.value || "");
            }}
            rightSection={loading ? <Loader size="xs" /> : null}
            clearable
            disabled={loading}
            required
            mt="md"
            />

            <Select
              label="Status Pegawai"
              data={[
                { value: "1", label: "Aktif" },
                { value: "0", label: "Tidak Aktif" },
              ]}
              key={form.key('statuspegawai')}
              {...form.getInputProps('statuspegawai')}
              placeholder="Pilih status pegawai"
              required
              mt="md"
            />

            <Select
              label="Status Akun"
              data={[
                { value: "1", label: "Aktif" },
                { value: "0", label: "Tidak Aktif" },
              ]}
              key={form.key('statusakun')}
              {...form.getInputProps('statusakun')}
              placeholder="Pilih status akun"
              required
              mt="md"
            />

            <PasswordInput
              mt="md"
              label="Password"
              placeholder="Password"
              key={form.key('password')}
              {...form.getInputProps('password')}
              required
            />
          </Stepper.Step>

          <Stepper.Step label="Second step" description="Personal information">
            <TextInput
              label="Nama"
              placeholder="Nama"
              key={form.key('nama')}
              {...form.getInputProps('nama')}
            />
            <TextInput
              mt="md"
              label="Email"
              placeholder="Email"
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
          </Stepper.Step>

          <Stepper.Step label="Final step" description="Selesai">
            <Code block mt="xl">
              {JSON.stringify(form.getValues(), null, 2)}
            </Code>
          </Stepper.Step>

          <Stepper.Completed>
            Registrasi selesai!
          </Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
        </Group>
      </Card>
    </>
  );
}
