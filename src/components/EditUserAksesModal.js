'use client';

import {
  Modal,
  TextInput,
  Select,
  Button,
  Group,
  Loader,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  getUserAksesByNippos,
  fetchHakAkses,
  updateUserAkses,
  encryptId,
} from '@/api/userAkses';
import { getIdAplikasi, isSuperAdmin } from '@/api/auth';

export default function EditUserAksesModal({ opened, onClose, nippos, idaplikasi, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [hakAksesOptions, setHakAksesOptions] = useState([]);

  const form = useForm({
    initialValues: {
      id: '',
      nippos: '',
      idHakAkses: '',
      statusUserAkses: '',
    },
  });

  useEffect(() => {
    if (!opened || !nippos || (!idaplikasi && isSuperAdmin())) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ambil id aplikasi sesuai role
        let encryptedId;
        if (isSuperAdmin()) {
          encryptedId = await encryptId(idaplikasi);
        } else {
          encryptedId = getIdAplikasi(); // sudah terenkripsi
        }

        // ambil data user akses
        const res = await getUserAksesByNippos(nippos, encryptedId);
        const data = res.data?.[0];
        if (!data) throw new Error('Data tidak ditemukan');

        form.setValues({
          id: data.idAkses,
          nippos: data.nippos,
          idHakAkses: String(data.idHakAkses),
          statusUserAkses: String(data.statusUserAkses),
        });

        // ambil hak akses
        const hakAksesListRaw = await fetchHakAkses(encryptedId);
        const hakAksesList = hakAksesListRaw.map((item) => ({
          value: String(item.idHakAkses),
          label: item.namaAkses,
        }));
        setHakAksesOptions(hakAksesList);
      } catch (err) {
        showNotification({
          title: 'Gagal Ambil Data',
          message: err.message,
          color: 'red',
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [opened, nippos, idaplikasi]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await updateUserAkses({
        id: values.id,
        nippos: values.nippos,
        idHakAkses: parseInt(values.idHakAkses),
        statusUserAkses: parseInt(values.statusUserAkses),
      });

      showNotification({
        title: 'Berhasil',
        message: 'User akses berhasil diperbarui.',
        color: 'green',
      });

      onClose();
      onSuccess?.();
    } catch (err) {
      showNotification({
        title: 'Gagal Update',
        message: err.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit User Akses"
      size="lg"
    >
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="NIPPOS" value={form.values.nippos} disabled />

          <Select
            label="Hak Akses"
            data={hakAksesOptions}
            value={form.values.idHakAkses}
            onChange={(val) => form.setFieldValue('idHakAkses', val)}
            required
          />

          <Select
            label="Status"
            value={form.values.statusUserAkses}
            onChange={(val) => form.setFieldValue('statusUserAkses', val)}
            data={[
              { value: '1', label: 'Aktif' },
              { value: '0', label: 'Nonaktif' },
            ]}
            required
          />

          <Group mt="lg">
            <Button type="submit" loading={loading}>
              Simpan Perubahan
            </Button>
          </Group>
        </form>
      )}
    </Modal>
  );
}
