"use client";

import { useEffect, useState } from "react";
import { Title, Loader, Select, Group, Stack, Button, TextInput, Flex, Card } from "@mantine/core";
import {
  fetchUserByApp,
  fetchUserByAppOrg,
  fetchUserByNippos,
  selectAplikasi,
  encryptId,
  fetchExternalOrg,
} from "@/api/user";
import { getIdAplikasi, isSuperAdmin } from "@/api/auth";
import GenericTable from "@/components/GenericTable";
import { handleApiResponse } from "@/utils/handleApiResponse";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconEdit, IconTrash, IconSearch, IconCheck } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useMemo } from "react";
import StatusPegawaiBadge from "@/components/StatusPegawaiBadge";
import StatusAkunBadge from "@/components/StatusAkunBadge";
import PageBreadCrumb from "@/components/PageBreadCrumb";
import CreateButton from "@/components/CreateButton";
import ActionDropDownButton from "@/components/ActionDropDownButton";
import { checkActiveUser, validateUser } from "@/api/user";

export default function UserManagementPage() {
  const columns = useMemo(
    () => [
      { accessorKey: "nippos", header: "NIPPOS" },
      { accessorKey: "nama", header: "Nama" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "jabatan", header: "Jabatan", size: 100},
      { accessorKey: "kantor", header: "Kantor" },
      { accessorKey: "nameExternalOrg", header: "Organisasi Eksternal", size:150 },
      {
        accessorKey: "status_pegawai",
        header: "Status Pegawai",
        size: 150,
        Cell: ({ cell }) => <StatusPegawaiBadge value={cell.getValue()} />,
      },
      {
        accessorKey: "status_akun",
        header: "Status Akun",
        size:100,
        Cell: ({ cell }) => <StatusAkunBadge value={cell.getValue()} />,
      },
      {
        id: "actions",
          header: "Aksi",
          Cell: ({ row }) => (
            <Flex gap="xs" wrap="nowrap">
              <Button
                size="xs"
                variant="light"
                color="blue"
                component={Link}
                href={`/user-akses/${row.original.id}/edit`}
                leftSection={<IconEdit size={14} />}
              >
                Edit
              </Button>
              <Button
                size="xs"
                variant="light"
                color="red"
                onClick={() => handleDelete(row.original.id, row.original.name)}
                leftSection={<IconTrash size={14} />}
              >
                Delete
              </Button>
            </Flex>
          ),
        },
    ],
    []
  );
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aplikasiOptions, setAplikasiOptions] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [externalOptions, setExternalOptions] = useState([]);
  const [selectedExternal, setSelectedExternal] = useState(null);
  const [nippos, setNippos] = useState("");
  const [loadingAplikasi, setLoadingAplikasi] = useState(false);
  const [loadingOrg, setLoadingOrg] = useState(false);

  const idApp = getIdAplikasi();
  const isSuper = isSuperAdmin();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const runFetchSequential = async () => {
        const now = Date.now();
        const lastAplikasiFetch = localStorage.getItem("last_aplikasi_fetch");
        const lastOrgFetch = localStorage.getItem("last_externalorg_fetch");

        let retryCount = 0;
        const maxRetries = 2;

        const loadAplikasi = async () => {
          if (lastAplikasiFetch && now - Number(lastAplikasiFetch) < 300000) {
            const cached = localStorage.getItem("aplikasi_options");
            if (cached) {
              setAplikasiOptions(JSON.parse(cached));
              return true;
            }
          }

          setLoadingAplikasi(true);
          let res;
          while (retryCount <= maxRetries) {
            res = await selectAplikasi();
            if (handleApiResponse(res, router)) {
              setAplikasiOptions(res.data);
              localStorage.setItem("aplikasi_options", JSON.stringify(res.data));
              localStorage.setItem("last_aplikasi_fetch", now.toString());
              setLoadingAplikasi(false);
              return true;
            } else {
              retryCount++;
              if (retryCount > maxRetries) {
                setAplikasiOptions([]);
                showNotification({
                  title: "Gagal memuat aplikasi",
                  message: "Server mungkin sedang bermasalah. Silakan coba beberapa saat lagi.",
                  color: "red",
                });
                setLoadingAplikasi(false);
                return false;
              }
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }
          setLoadingAplikasi(false);
          return false;
        };

        const loadOrg = async () => {
          retryCount = 0;
          if (lastOrgFetch && now - Number(lastOrgFetch) < 300000) {
            const cached = localStorage.getItem("external_options");
            if (cached) {
              setExternalOptions(JSON.parse(cached));
              return;
            }
          }

          setLoadingOrg(true);
          let res;
          while (retryCount <= maxRetries) {
            res = await fetchExternalOrg();
            if (handleApiResponse(res, router)) {
              const mapped = res.data.map((org) => ({
                label: org.nameOrganization,
                value: org.id_external_org,
              }));
              const finalOptions = [{ value: "all", label: "Semua" }, ...mapped];
              setExternalOptions(finalOptions);
              localStorage.setItem("external_options", JSON.stringify(finalOptions));
              localStorage.setItem("last_externalorg_fetch", now.toString());
              break;
            } else {
              retryCount++;
              if (retryCount > maxRetries) {
                setExternalOptions([]);
                showNotification({
                  title: "Gagal memuat organisasi eksternal",
                  message: "Server mungkin sedang bermasalah. Silakan coba beberapa saat lagi.",
                  color: "red",
                });
                break;
              }
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }
          setLoadingOrg(false);
        };

        const success = isSuper ? await loadAplikasi() : true;
if (success) await loadOrg();
      };
      runFetchSequential();
    }, 500);

    return () => clearTimeout(timeout);
  }, [idApp, router]);

  const normalizeUser = (user) => ({
  nippos: user.nippos,
  nama: user.nama,
  email: user.email,
  jabatan: user.jabatan,
  kantor: user.namaKantor || user.kantor || "-",
  nameExternalOrg: user.nameExternalOrg || "-",
  status_pegawai: user.status_pegawai ?? user.codeStatusPegawai,
  status_akun: user.status_akun ?? user.codeStatusAkun,
  id: user.id || user.nippos,
});

  const handleFetch = async () => {
    setLoading(true);
    let response;

    const noInput = !nippos && (!selectedApp || selectedApp === '') && !selectedExternal;

    if (noInput) {
      if (isSuper) {
        response = await fetchUserByNippos("");
      } else {
        response = await fetchUserByApp(idApp);
      }
    } else if (nippos) {
      response = await fetchUserByNippos(nippos);
    } else if (isSuper && selectedApp && selectedExternal) {
      const res = await encryptId(selectedApp);
      if (!handleApiResponse(res, router)) {
        setLoading(false);
        return;
      }
      response = await fetchUserByAppOrg(res.data, selectedExternal);
    } else if (isSuper && selectedApp) {
      const res = await encryptId(selectedApp);
      if (!handleApiResponse(res, router)) {
        setLoading(false);
        return;
      }
      response = await fetchUserByApp(res.data);
    } else if (!isSuper && selectedExternal) {
      response = await fetchUserByAppOrg(idApp, selectedExternal);
    } else {
      response = await fetchUserByApp(idApp);
    }

    if (handleApiResponse(response, router)) {
  const rawData = Array.isArray(response.data?.data) ? response.data.data : response.data;
  const mapped = Array.isArray(rawData)
  ? rawData.map(normalizeUser).filter(user => isSuper || user.status_pegawai !== 1)
  : [];
  setData(mapped);
}

    setLoading(false);
  };

  return (
    <>
    <PageBreadCrumb />
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Manajemen User External</Title>
        <Group>
          <CreateButton entity="user" useModal onClick={() => setOpened(true)} />
        <ActionDropDownButton
            actions={[
              {
                label: "Cek Status Akun",
                icon: <IconSearch size={16} />,
                color: "blue",
                type: "modal",
                modalTitle: "Cek Status Akun",
                onSubmitNippos: async (nippos) => {
                  const res = await checkActiveUser(nippos);
                  if (handleApiResponse(res, router)) {
                    showNotification({
                      title: "Berhasil Check Akun",
                      message: "Status Akun User Aktif",
                      color: "green",
                    });
                  }
                },
              },
              {
                label: "Validasi Akun",
                icon: <IconCheck size={16} />,
                color: "teal",
                type: "modal",
                modalTitle: "Validasi Akun",
                onSubmitNippos: async (nippos) => {
                  const res = await validateUser(nippos);
                  if (handleApiResponse(res, router)) {
                    showNotification({
                      title: "Validasi Berhasil",
                      message: "Akun berhasil divalidasi",
                      color: "green",
                    });
                  }
                },
              },
            ]}
          />
        </Group>

      </Flex>
      <Stack>
      <Card shadow="sm" padding="xl" radius="md" withBorder style={{ backgroundColor: "white" }}>
      <Group align="flex-end" grow>
        <TextInput
        label="Cari Berdasarkan NIPPOS"
        placeholder="Masukkan nippos..."
        value={nippos}
        onChange={(e) => setNippos(e.currentTarget.value)}
      />
        {isSuper && (
          <Select
            label="Pilih Aplikasi"
            placeholder="Pilih Aplikasi"
            data={aplikasiOptions}
            value={selectedApp}
            onChange={setSelectedApp}
            clearable
            rightSection={loadingAplikasi ? <Loader size="xs" /> : null}
          />
        )}

        <Select
          label="Pilih Organisasi Eksternal"
          placeholder="Pilih Organisasi"
          data={externalOptions}
          value={selectedExternal}
          onChange={setSelectedExternal}
          clearable
          disabled={isSuper && !selectedApp}
          rightSection={loadingOrg ? <Loader size="xs" /> : null}
        />
        <Button onClick={handleFetch} disabled={loading} loading={loading}>
          Tampilkan Data
        </Button>
      </Group>
      </Card>
        {loading && (
          <Flex justify="center" align="center" style={{ minHeight: 200 }}>
            <Loader variant="bars" color="blue" size="lg" />
          </Flex>
        )}

      {data.length > 0 && <GenericTable data={data} columns={columns} />}
    </Stack>
    </>
  );
}
