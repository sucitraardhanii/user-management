// app/user/external/edit/[nippos]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextInput, Select, Button, Card, Group, Flex, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import PageBreadCrumb from "@/components/PageBreadCrumb";
import CancelButton from "@/components/CancelButton";
import {
  fetchUserByNippos,
  fetchExternalOrg,
  updateUser,
  fetchUser
} from "@/api/user";

import {
  fetchAllKantor,
  fetchJabatan,
} from "@/api/menu";

export default function EditUserExternalPage() {
  const { nippos } = useParams();
  const router = useRouter();
  const decodedNippos = decodeURIComponent(nippos);
  const [loading, setLoading] = useState(true);
  const [kantorOptions, setKantorOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [externalOrgOptions, setExternalOrgOptions] = useState([]);

  const form = useForm({
    initialValues: {
      nippos: "",
      nama: "",
      email: "",
      codeJabatan: "",
      kantor: "",
      id_external_org: "",
      statuspegawai: "",
      statusakun: "",
      regional: "",
      kcu: "",
      kc: "",
      kcp: ""
    }
  });

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      // Fetch semua data
      const [userRes, jabatanResRaw, orgRes] = await Promise.all([
        fetchUser(decodedNippos),
        fetchJabatan(), // boleh dikomen kalau nggak perlu
        fetchExternalOrg(),
      ]);

      // Validasi user
      const user = Array.isArray(userRes?.data)
        ? userRes.data[0]
        : userRes.data;

      if (!user) {
        showNotification({
          title: "User tidak ditemukan",
          message: `Data untuk ${decodedNippos} tidak ditemukan`,
          color: "red",
        });
        router.push("/user");
        return;
      }

      const codeJabatanStr = String(user.code_jabatan ?? "").trim();

      // --- JABATAN ---
      let finalJabatanOptions = Array.isArray(jabatanResRaw) ? [...jabatanResRaw] : [];
      const isJabatanAda = finalJabatanOptions.some(
        (j) => j.value === codeJabatanStr
      );
      if (!isJabatanAda && codeJabatanStr) {
        finalJabatanOptions.push({
          value: codeJabatanStr,
          label: `${codeJabatanStr} - (Jabatan dari user)`,
        });
      }
      setJabatanOptions(finalJabatanOptions);

      // --- EXTERNAL ORG ---
      const orgList = Array.isArray(orgRes?.data) ? orgRes.data : [];
      setExternalOrgOptions(
        orgList.map((o) => ({
          value: o.id_external_org,
          label: o.nameOrganization,
        }))
      );

      const orgMatch = orgList.find(
        (org) =>
          org.nameOrganization?.toLowerCase().trim() ===
          user.nameExternalOrg?.toLowerCase().trim()
      );

      if (!orgMatch && user.nameExternalOrg) {
        console.warn("⚠️ External Org tidak ditemukan untuk:", user.nameExternalOrg);
      }

      // --- SET FORM (terakhir) ---
      form.setValues({
        nippos: user.nippos || "",
        nama: user.nama || "",
        email: user.nippos || "",
        codeJabatan: codeJabatanStr,
        kantor: user.kantor || "",
        id_external_org: orgMatch?.id_external_org || "",
        statuspegawai: String(user.status_pegawai ?? ""),
        statusakun: String(user.status_akun ?? ""),
        regional: user.regional || "",
        kcu: user.kcu || "",
        kc: user.kc || "",
        kcp: user.kcp || "",
      });
    } catch (err) {
      console.error("❌ Gagal memuat data:", err);
      showNotification({
        title: "Error",
        message: "Gagal memuat data. Silakan coba lagi.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [decodedNippos]);




  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      codeJabatan: values.codeJabatan,
      email: values.nippos,
      statuspegawai: Number(values.statuspegawai),
      statusakun: Number(values.statusakun)
    };
    delete payload.code_jabatan;

    const res = await updateUser(payload);

    if (res?.error) {
      showNotification({
        title: "Gagal Update",
        message: res?.detail || "Terjadi kesalahan",
        color: "red"
      });
    } else {
      showNotification({
        title: "Berhasil",
        message: "Data user berhasil diperbarui",
        color: "green"
      });
      router.push("/user/external");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageBreadCrumb />
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Edit Data User</Title>
      </Flex>

      <Card shadow="sm" padding="xl" radius="md" withBorder style={{ backgroundColor: "white" }}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group align="flex-end" grow>
            <TextInput label="NIPPOS" disabled {...form.getInputProps("nippos")} />
            <TextInput label="Email (otomatis)" disabled {...form.getInputProps("email")} />
          </Group>

          <Group align="flex-end" grow>
            <TextInput label="Nama Lengkap" required {...form.getInputProps("nama")} />
            <Select
              label="Status Pegawai"
              data={[
                { value: "1", label: "Organik" },
                { value: "2", label: "Non-Organik" },
                { value: "3", label: "Bypass" },
                { value: "4", label: "Eksternal" }
              ]}
              required
              {...form.getInputProps("statuspegawai")}
            />
            <Select
              label="Status Akun"
              data={[
                { value: "1", label: "Aktif" },
                { value: "0", label: "Tidak Aktif" }
              ]}
              required
              {...form.getInputProps("statusakun")}
            />
          </Group>

          <Group align="flex-end" grow>
            <Select
              label="Kantor"
              data={kantorOptions}
              searchable
              required
              {...form.getInputProps("kantor")}
            />
            <Select
            label="Jabatan"
            data={jabatanOptions}
            searchable
            disabled={loading}
            {...form.getInputProps("codeJabatan")}
          />


            <Select
              label="External Organisasi"
              data={externalOrgOptions}
              searchable
              required
              {...form.getInputProps("id_external_org")}
            />
          </Group>

          <Group align="flex-end" grow>
            <TextInput label="Regional" {...form.getInputProps("regional")} />
            <TextInput label="KCU" {...form.getInputProps("kcu")} />
            <TextInput label="KC" {...form.getInputProps("kc")} />
            <TextInput label="KCP" {...form.getInputProps("kcp")} />
          </Group>

          <Group mt="md" position="right">
            <CancelButton />
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Card>
    </>
  );
}
