"use client";

import { useState, useEffect } from 'react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Code,
  Card,
  Title,
  Select,
  Autocomplete,
  SimpleGrid,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import Breadcrumb from "@/components/BreadCrumb";
import { fetchJabatan, searchKantor, fetchAllKantor } from "@/api/menu";
import { fetchAplikasi, encryptId, fetchHakAkses,fetchExternalOrg } from "@/api/regisUserExtern";
import { showNotification } from "@mantine/notifications";

export default function RegistrasiUser() {
  const [active, setActive] = useState(0);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [kantorOptions, setKantorOptions] = useState([]);
  const [allKantorCache, setAllKantorCache] = useState([]);
  const [kantorInput, setKantorInput] = useState("");
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [hakAksesOptions, setHakAksesOptions] = useState([]);
  const [externalOrgOptions, setExternalOrgOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingKantor, setLoadingKantor] = useState(false);
  const [loadingHakAkses, setLoadingHakAkses] = useState(false);
  const [debounced] = useDebouncedValue(kantorInput, 300);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      nippos: '',
      email: '',
      nama: '',
      codeJabatan: '',
      kantor: '',
      statusakun: '',
      password: '',
      idaplikasi: '',
      idhakakses: '',
      id_external_org:'',
    },
    validate: (values) => {
      if (active === 0) {
        return {
          password: values.password.length < 6 ? 'Password minimal 6 karakter' : null,
        };
      }

      if (active === 1) {
        return {
          email: /^\S+@\S+$/.test(values.email) ? null : 'Format email tidak valid',
        };
      }
      if (values.nippos !== values.email) {
        errors.nippos = "Nippos dan Email harus sama";
        errors.email = "Email dan Nippos harus sama";
      }
      
      return {};
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [jabatan, semuaKantor, aplikasi, eksternalOrg] = await Promise.all([
          fetchJabatan(),
          fetchAllKantor(),
          fetchAplikasi(),
          fetchExternalOrg(),
        ]);
        setJabatanOptions(jabatan);
        setAllKantorCache(semuaKantor);
        setAplikasiOptions(aplikasi);
        setExternalOrgOptions(eksternalOrg);
      } catch (err) {
        console.error("Gagal ambil data awal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const doSearch = async () => {
      if (!debounced) return;

      if (/^\d+$/.test(debounced)) {
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

  useEffect(() => {
    const selected = form.getValues().idaplikasi;
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

  const uniqueByValue = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.value)) return false;
      seen.add(item.value);
      return true;
    });
  };

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // Create Data
  const handleSubmit = async () => {
    const values = form.getValues();

    const payloadUser = {
      nippos: values.nippos,
      email: values.email,
      nama: values.nama,
      codeJabatan: values.codeJabatan,
      kantor: values.kantor,
      statuspegawai: 4, //registrasi-user external
      statusakun: values.statusakun,
      password: values.password,
    };

    const payloadAkses = {
      nippos: values.nippos,
      idHakAkses: values.idhakakses,
      statusUserAkses: 1
    };

    try {
      await createUser(payloadUser);
      await createUserAkses(payloadAkses);

      showNotification({
        title: "Berhasil",
        message: "User dan akses berhasil dibuat!",
        color: "green",
      });
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Gagal",
        message: err.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <Title order={3} mb="md">Registrasi User External</Title>
      <Breadcrumb />

      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stepper active={active}>
          <Stepper.Step label="Step 1" description="Data User">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput label="Nippos"
              required {...form.getInputProps('nippos')}
              placeholder='Samakan dengan email'
              onChange={(event) => {
                const val = event.currentTarget.value;
                form.setFieldValue("email", val);
                form.setFieldValue("nippos", val);
              }}
              />
            <TextInput label="Email" required {...form.getInputProps('email')} 
            placeholder='Samakan dengan Nippos'
            onChange={(event) => {
              const val = event.currentTarget.value;
              form.setFieldValue("nippos", val);
              form.setFieldValue("email", val);
            }}
            />
            <TextInput label="Nama" required {...form.getInputProps('nama')} />
            <PasswordInput label="Password" required {...form.getInputProps('password')}  />
            <Select
              label="Pilih Jabatan"
              placeholder={loading ? "Loading..." : "Pilih jabatan"}
              data={jabatanOptions}
              {...form.getInputProps('codeJabatan')}
              searchable
              clearable
              disabled={loading}
              required
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
              rightSection={loadingKantor ? <Loader size="xs" /> : null}
              clearable
              disabled={loading}
              required
              
            />
            <Select
              label="Organisasi Eksternal"
              placeholder="Pilih organisasi"
              data={externalOrgOptions}
              key={form.key('externalOrg')}
              {...form.getInputProps('externalOrg')}
              clearable
              searchable
              disabled={loading}
              required
            />
            <Select
              label="Status Akun"
              data={[{ value: "1", label: "Aktif" }, { value: "0", label: "Tidak Aktif" }]}
              {...form.getInputProps('statusakun')}
              placeholder="Pilih status akun"
              required
              
            />
            
            </SimpleGrid>
          </Stepper.Step>

          <Stepper.Step label="Step 2" description="Akses Aplikasi">
            <Select
              label="Pilih Aplikasi"
              data={aplikasiOptions}
              {...form.getInputProps('idaplikasi')}
              placeholder="Pilih aplikasi"
              searchable
              clearable
              required
              disabled={loading}
              rightSection={loading ? <Loader size="xs" /> : null}
            />

            <Select
              label="Pilih Hak Akses"
              data={hakAksesOptions}
              {...form.getInputProps('idhakakses')}
              placeholder={loadingHakAkses ? "Memuat..." : "Pilih hak akses"}
              searchable
              clearable
              required
              
              disabled={loading}
             rightSection={loading ? <Loader size="xs" /> : null}
            />
          </Stepper.Step>

          <Stepper.Step label="Step 3" description="Selesai">
            <Code block mt="xl">
              {JSON.stringify(form.getValues(), null, 2)}
            </Code>
          </Stepper.Step>

          <Stepper.Step label="Step 4" description="Selesai">
            <Code block mt="xl">
              {JSON.stringify(form.getValues(), null, 2)}
            </Code>
          </Stepper.Step>

          <Stepper.Completed>Registrasi selesai!</Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
          {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
        </Group>
      </Card>
    </>
  );
}
