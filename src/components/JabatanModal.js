"use client";

import { Modal, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { createJabatan, updateJabatan } from "@/api/jabatan";

export default function JabatanModal({
  opened,
  onClose,
  initialData,
  refresh,
}) {
  const form = useForm({
    initialValues: {
      namaJabatan: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        namaJabatan: initialData.namajabatan || "",
      });
    } else {
      form.setValues({
        namaJabatan: "",
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      const payload = {
        id: initialData?.idjabatan,
        namaJabatan: form.values.namaJabatan,
      };

      if (initialData) {
        await updateJabatan(payload);
      } else {
        await createJabatan(payload);
      }

      refresh();
      onClose();
    } catch (err) {
      console.error("Gagal simpan jabatan:", err);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialData ? "Edit Jabatan" : "Tambah Jabatan"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nama Jabatan"
          placeholder="Masukkan Nama Jabatan"
          required
          {...form.getInputProps("namaJabatan")}
        />
        <Button fullWidth mt="md" type="submit">
          Simpan
        </Button>
      </form>
    </Modal>
  );
}
