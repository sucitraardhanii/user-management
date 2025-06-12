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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Breadcrumb from "@/components/BreadCrumb";
import { fetchJabatan } from "@/api/menu";


export default function RegistrasiUser() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const getData = async () => {
    try {
      const result = await fetchJabatan();
      setData(result);
    } catch (err) {
      console.error("Gagal ambil data jabatan:", err);
    } finally {
      setLoading(false);
    }
  };
  getData();
}, []);

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

            {/* Select Jabatan */}
            <Select
              label="Pilih Jabatan"
              placeholder={loading ? "Loading..." : "Pilih jabatan"}
              data={data}
              key={form.key('codeJabatan')}
              {...form.getInputProps('codeJabatan')}
              searchable
              clearable
              disabled={loading}
              required
              mt="md"
            />

            {/* Status Pegawai */}
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

            {/* Status Akun */}
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

          <Stepper.Step label="Final step" description="Social media">
            <TextInput label="Website" placeholder="Website" />
            <TextInput mt="md" label="GitHub" placeholder="GitHub" />
          </Stepper.Step>

          <Stepper.Completed>
            Completed! Form values:
            <Code block mt="xl">
              {JSON.stringify(form.getValues(), null, 2)}
            </Code>
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
