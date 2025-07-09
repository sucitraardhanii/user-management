"use client";

import { useState, useEffect } from "react";
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
  Grid,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import Breadcrumb from "@/components/BreadCrumb";
import { fetchJabatan, searchKantor, fetchAllKantor } from "@/api/Allmenu";
import {
  fetchAplikasi,
  encryptId,
  fetchHakAkses,
  fetchExternalOrg,
  createUser,
  createUserAkses,
  validasiUser,
} from "@/api/regisUserExtern";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function RegistrasiUser() {
  const router = useRouter();
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
    mode: "uncontrolled",
    initialValues: {
      nippos: "",
      email: "",
      nama: "",
      codeJabatan: "",
      kantor: "",
      statusakun: "",
      password: "",
      idaplikasi: "",
      idhakakses: "",
      encryptId: "",
    },
    validate: (values) => {
      if (active === 0) {
        return {
          password:
            values.password.length < 6 ? "Password minimal 6 karakter" : null,
        };
      }

      if (active === 1) {
        return {
          email: /^\S+@\S+$/.test(values.email)
            ? null
            : "Format email tidak valid",
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
        const [jabatan, semuaKantor, aplikasi, eksternalOrg] =
          await Promise.all([
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

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // Create Data
  const handleSubmit = async () => {
    const values = form.getValues();
    const encryptedId = await encryptId(form.getValues().idaplikasi);
    const payloadUser = {
      nippos: values.nippos,
      email: values.email,
      nama: values.nama,
      codeJabatan: values.codeJabatan,
      kantor: values.kantor,
      statuspegawai: 4, //registrasi-user external
      statusakun: 1,
      password: values.password,
      id_external_org: values.externalOrg,
    };
    const payloadValidasi = {
      nippos: values.nippos,
      statusakun: 1,
    };
    // const payloadActive = {
    //   nippos: values.nippos,
    // };

    const payloadAkses = {
      nippos: values.nippos,
      idHakAkses: values.idhakakses,
      statusUserAkses: 1,
    };

    try {
      await createUser(payloadUser);
      await validasiUser(payloadValidasi);
      // await activeUser(payloadActive);
      await createUserAkses(payloadAkses);

      showNotification({
        title: "User berhasil dibuat",
        message: (
          <>
            <div>
              <strong>📩Email:</strong> {values.email}
            </div>
            <div>
              <strong>🔐Encrypted ID:</strong> {encryptedId}
            </div>
          </>
        ),
        icon: <IconCheck size={20} />,
        color: "teal",
        autoClose: false,
      });
      router.push("/user");
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
      <Title order={3} mb="md">
        Registrasi User External
      </Title>
      <Breadcrumb />

      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stepper active={active}>
          <Stepper.Step label="Step 1" description="Data User">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Nippos"
                required
                {...form.getInputProps("nippos")}
                placeholder="Samakan dengan email"
                onChange={(event) => {
                  const val = event.currentTarget.value;
                  form.setFieldValue("email", val);
                  form.setFieldValue("nippos", val);
                }}
              />
              <TextInput
                label="Email"
                required
                {...form.getInputProps("email")}
                placeholder="Samakan dengan Nippos"
                onChange={(event) => {
                  const val = event.currentTarget.value;
                  form.setFieldValue("nippos", val);
                  form.setFieldValue("email", val);
                }}
              />
              <TextInput
                label="Nama"
                required
                {...form.getInputProps("nama")}
              />
              <PasswordInput
                label="Password"
                required
                {...form.getInputProps("password")}
              />
              <Select
                label="Pilih Jabatan"
                placeholder={loading ? "Loading..." : "Pilih jabatan"}
                data={jabatanOptions}
                {...form.getInputProps("codeJabatan")}
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
                  const selected = kantorOptions.find(
                    (opt) => opt.label === val
                  );
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
                key={form.key("externalOrg")}
                {...form.getInputProps("externalOrg")}
                clearable
                searchable
                disabled={loading}
                required
              />
            </SimpleGrid>
          </Stepper.Step>

          <Stepper.Step label="Step 2" description="Akses Aplikasi">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
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
                disabled={loading || !form.values.idaplikasi || loadingHakAkses}
                rightSection={loadingHakAkses ? <Loader size="xs" /> : null}
              />
            </SimpleGrid>
          </Stepper.Step>

          <Stepper.Step label="Step 3" description="Review Json">
            <Code block mt="xl">
              {JSON.stringify(form.getValues(), null, 2)}
            </Code>
          </Stepper.Step>

          <Stepper.Step label="Step 4" description="Selesai">
            <Grid>
              <Grid.Col span={6}>
                <Text>
                  <strong>Nippos:</strong> {form.values.nippos}
                </Text>
                <Text>
                  <strong>Email:</strong> {form.values.email}
                </Text>
                <Text>
                  <strong>Nama:</strong> {form.values.nama}
                </Text>
                <Text>
                  <strong>Jabatan:</strong> {form.values.codeJabatan}
                </Text>
                <Text>
                  <strong>Aplikasi:</strong> {form.values.idaplikasi}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>
                  <strong>Kantor:</strong> {form.values.kantor}
                </Text>
                <Text>
                  <strong>Status Pegawai:</strong> External{" "}
                </Text>
                <Text>
                  <strong>Status Akun:</strong> {form.values.statusakun}
                </Text>
                <Text>
                  <strong>Hak Akses:</strong> {form.values.idhakakses}
                </Text>
                <Text>
                  <strong>Password:</strong> {form.values.password}
                </Text>
              </Grid.Col>
            </Grid>
          </Stepper.Step>

          <Stepper.Completed>Registrasi selesai!</Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
          {active == 3 && (
            <Button
              onClick={async () => {
                const confirm = window.confirm(
                  "Apakah kamu yakin ingin menyimpan data?"
                );
                if (confirm) {
                  await handleSubmit();
                }
              }}
              color="teal"
            >
              Submit
            </Button>
          )}
        </Group>
      </Card>
    </>
  );
}
