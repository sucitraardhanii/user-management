"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TextInput,
  Select,
  Button,
  Card,
  Group,
  Flex,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import PageBreadCrumb from "@/components/PageBreadCrumb";
import CancelButton from "@/components/CancelButton";
import {
  fetchUserByNippos,
  fetchExternalOrg,
  updateUser,
  fetchUser,
  searchKantor,
  fetchAllKantor
} from "@/api/user";
import { fetchJabatan } from "@/api/menu";
import { useDebouncedValue } from "@mantine/hooks";

export default function EditUserExternalPage() {
  const { nippos } = useParams();
  const router = useRouter();
  const decodedNippos = decodeURIComponent(nippos);
  const [loading, setLoading] = useState(true);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [externalOrgOptions, setExternalOrgOptions] = useState([]);
  const [isExternalOrgMissing, setIsExternalOrgMissing] = useState(false);

  const [kantorOptions, setKantorOptions] = useState([]);
  const [searchKantorValue, setSearchKantorValue] = useState("");
  const [debouncedSearchKantor] = useDebouncedValue(searchKantorValue, 100);


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
        const [userRes, jabatanResRaw, orgResRaw] = await Promise.all([
          fetchUser(decodedNippos),
          fetchJabatan(),
          fetchExternalOrg()
        ]);

        const user = Array.isArray(userRes?.data)
          ? userRes.data[0]
          : userRes.data;

        if (!user) {
          showNotification({
            title: "User tidak ditemukan",
            message: `Data untuk ${decodedNippos} tidak ditemukan`,
            color: "red"
          });
          router.push("/user");
          return;
        }

        // Coba ambil kantor awal (jika ada)
       if (user.nopend) {
        try {
          const kantorList = await searchKantor(user.nopend);
          const selected = kantorList.find((k) => k.value === user.nopend);

          if (selected) {
            setKantorOptions((prev) => mergeUniqueKantor(prev, [selected]));
          } else {
            // fallback manual jika tidak ditemukan di hasil API
            setKantorOptions((prev) =>
              mergeUniqueKantor(prev, [
                {
                  value: user.nopend,
                  label: user.kantor || user.nopend
                }
              ])
            );
          }
        } catch (err) {
          console.warn("⚠️ Gagal ambil kantor dari nopend:", user.nopend);
          setKantorOptions((prev) =>
            mergeUniqueKantor(prev, [
              {
                value: user.nopend,
                label: user.kantor || user.nopend
              }
            ])
          );
        }
      }



        const codeJabatanStr = String(user.code_jabatan ?? "").trim();

        // Set jabatan
        let finalJabatanOptions = Array.isArray(jabatanResRaw) ? [...jabatanResRaw] : [];
        const isJabatanAda = finalJabatanOptions.some(
          (j) => j.value === codeJabatanStr
        );
        if (!isJabatanAda && codeJabatanStr) {
          finalJabatanOptions.push({
            value: codeJabatanStr,
            label: `${codeJabatanStr} - (Jabatan dari user)`
          });
        }
        setJabatanOptions(finalJabatanOptions);

        // Set external org
        const orgList = orgResRaw?.data || [];
        const activeOrgOnly = orgList.filter((org) => org.statusCodeAktif === 1);

        

        const orgMatch = activeOrgOnly.find(
          (o) =>
            o.nameOrganization?.trim().toLowerCase() ===
            (user.nameExternalOrg ?? "").trim().toLowerCase()
        );

        setExternalOrgOptions(
          activeOrgOnly.map((item) => ({
            value: item.id_external_org,
            label: item.nameOrganization
          }))
        );
        

        if (!orgMatch && user.nameExternalOrg) {
          console.warn("⚠️ External Org tidak ditemukan:", user.nameExternalOrg);
        }

        setIsExternalOrgMissing(!user.nameExternalOrg);

        form.setValues({
          nippos: user.nippos || "",
          nama: user.nama || "",
          email: user.nippos || "",
          codeJabatan: codeJabatanStr,
          kantor: user.nopend || "",
          id_external_org: orgMatch?.id_external_org || "",
          statuspegawai: String(user.status_pegawai ?? ""),
          statusakun: String(user.status_akun ?? ""),
          regional: user.regional || "",
          kcu: user.kcu || "",
          kc: user.kc || "",
          kcp: user.kcp || ""
        });
      } catch (err) {
        console.error("❌ Gagal memuat data:", err);
        showNotification({
          title: "Error",
          message: "Gagal memuat data. Silakan coba lagi.",
          color: "red"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedNippos]);

useEffect(() => {
  const loadKantor = async () => {
    const result = await searchKantor(debouncedSearchKantor);
    setKantorOptions((prev) => mergeUniqueKantor(prev, result));
  };

  if (debouncedSearchKantor.length >= 2) {
    loadKantor();
  }
}, [debouncedSearchKantor]);

const mergeUniqueKantor = (...arrays) => {
  const seen = new Set();
  return arrays.flat().filter((item) => {
    const val = String(item.value);
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      codeJabatan: values.codeJabatan,
      email: values.nippos,
      statuspegawai: Number(values.statuspegawai),
      statusakun: Number(values.statusakun)
    };

    delete payload.code_jabatan;
      // Hapus field kosong
      ["kc", "kcp", "kcu", "regional"].forEach((key) => {
        if (!payload[key]) {
          delete payload[key];
        }
      });

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
            searchable
            data={kantorOptions}
            value={form.values.kantor}
            onChange={(val) => form.setFieldValue("kantor", val)}
            onSearchChange={setSearchKantorValue}
            required
          />

            <Select
              label="Jabatan"
              data={jabatanOptions}
              searchable
              disabled={loading}
              {...form.getInputProps("codeJabatan")}
            />
            <div style={{ flex: 1 }}>
            <Select
              label="External Organisasi"
              data={externalOrgOptions}
              searchable
              required
              error={isExternalOrgMissing ? "User belum memiliki data External Org" : undefined}
              {...form.getInputProps("id_external_org")}
            />
            {isExternalOrgMissing && (
              <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Data external org belum dilengkapi oleh user.
              </p>
            )}
          </div>

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
