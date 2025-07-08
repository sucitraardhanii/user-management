"use client";

import { Modal, TextInput, NumberInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createMenu } from "@/api/Allmenu";

export default function MenuModal({ opened, onClose, refresh }) {
  const form = useForm({
    initialValues: {
      nama: "",
      alamatAkses: "",
      idaplikasi: 0,
      idhakakses: 0,
      idParent: 0,
      layer: 1,
      statusParent: 0,
    },
  });

  const handleSubmit = async () => {
    try {
      const payload = form.values;
      console.log("Payload Menu:", payload);
      await createMenu(payload);
      refresh();
      onClose();
    } catch (err) {
      console.error("Gagal buat menu:", err.message);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Tambah Menu" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Nama Menu" required {...form.getInputProps("nama")} />
        <TextInput
          label="Alamat Akses"
          required
          {...form.getInputProps("alamatAkses")}
        />
        <NumberInput
          label="ID Aplikasi"
          required
          {...form.getInputProps("idaplikasi")}
        />
        <NumberInput
          label="ID Hak Akses"
          required
          {...form.getInputProps("idhakakses")}
        />
        <NumberInput label="ID Parent" {...form.getInputProps("idParent")} />
        <NumberInput label="Layer" {...form.getInputProps("layer")} />
        <NumberInput
          label="Status Parent"
          {...form.getInputProps("statusParent")}
        />

        <Button fullWidth mt="md" type="submit">
          Simpan
        </Button>
      </form>
    </Modal>
  );
}
