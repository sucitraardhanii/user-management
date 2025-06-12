"use client";

import { useState } from 'react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Code,
  Card,
  Title,
  Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Breadcrumb from "@/components/BreadCrumb";

export default function RegistrasiUser() {
  const [active, setActive] = useState(0);

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
        password:''
    },
    validate: (values) => {
      if (active === 0) {
        return {
          usernama:
            values.nippos.trim().length < 6
              ? 'Nippos'
              : null,
          password:
            values.password.length < 6 ? 'Password must include at least 6 characters' : null,
        };
      }

      if (active === 1) {
        return {
          nama: values.nama.trim().length < 2 ? 'nama must include at least 2 characters' : null,
          email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
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
      <Title order={3} mb="md">
        Registrasi User
      </Title>

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
          <TextInput
            label="NIPPOS"
            placeholder="NIPPOS"
            key={form.key('nippos')}
            {...form.getInputProps('nippos')}
            required
          />
          {/* Select Kantor */}
          <TextInput
            label="NIPPOS"
            placeholder="NIPPOS"
            key={form.key('nippos')}
            {...form.getInputProps('nippos')}
            required
          />
          <Select
            label="Status Pegawai"
            value={form.statuspegawai}
             onChange={(val) => setForm({ ...form, status: val })}
            data={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Tidak Aktif" },
            ]}
            placeholder="Pilih status"
             required
            mb="sm"
            />
            <Select
            label="Status Akun"
            value={form.statusakun}
             onChange={(val) => setForm({ ...form, status: val })}
            data={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Tidak Aktif" },
            ]}
            placeholder="Pilih status"
             required
            mb="sm"
            />
          <PasswordInput
            mt="md"
            label="Password"
            placeholder="Password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
        </Stepper.Step>

        <Stepper.Step label="Second step" description="Personal information">
          <TextInput
            label="nama"
            placeholder="nama"
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
          <TextInput
            label="Website"
            placeholder="Website"
            key={form.key('website')}
            {...form.getInputProps('website')}
          />
          <TextInput
            mt="md"
            label="GitHub"
            placeholder="GitHub"
            key={form.key('github')}
            {...form.getInputProps('github')}
          />
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
