import { Modal, Text, ThemeIcon, Switch, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Autocomplete } from "@mantine/core";
import { searchUserNippos, fetchAllUserNippos } from "@/api/userAkses";
import { IconPencil } from "@tabler/icons-react";
// Mantine komponen Modal, TextInput, Switch, Button, Group untuk membuat modal edit user akses.
// useForm untuk mengelola form state dan validasi.
// useEffect untuk memperbarui nilai form ketika editData berubah.

export default function UserAksesEditModal({
  opened, // Modal terbuka atau tidak
  onClose, // Fungsi untuk menutup modal
  editData, // Data yang akan diedit, berisi nippos dan statusUserAkses
  onSubmit, // Fungsi yang akan dipanggil saat form disubmit
}) {
  const [nipposOptions, setNipposOptions] = useState([]);

  const form = useForm({
    initialValues: {
      //nilai awal form untuk nippos dan statusUserAkses
      nippos: editData?.nippos,
      statusUserAkses: editData?.statusUserAkses == 1,
    },
    validate: {
      nippos: (value) => (value ? null : "Nippos tidak boleh kosong"),
    },
  });

  useEffect(() => {
    if (editData) {
      form.setFieldValue("nippos", editData.nippos);
      form.setFieldValue("statusUserAkses", editData.statusUserAkses == 1);
    }

    // 🔄 Ambil list nippos
    fetchAllUserNippos().then((result) => {
      const options = result.map((item) => item.nippos);
      setNipposOptions(result); // pastikan result berupa list nippos
    });
  }, [editData]);

  // ketika Editdata berubah (biasanya setelah user klik tombol edit), form otomatis terisi dengan data tsb.
  // statusUserAkses diubah menjadi boolean (true/false) berdasarkan nilai yang diterima (1 untuk true, 0 untuk false).

  const handleSearch = async (query) => {
    const result = await searchUserNippos(query);
    const options = result.map((item) => item.nippos); // atau item.label
    setNipposOptions(options);
  };
  // values berisi nilai nippos dan statusUserAkses yang telah diisi oleh pengguna.
  // kemudian akan diteruskan ke handleUpdate di page.js

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      overlayProps={{ blur: 2 }}
      styles={{
        header: {
          marginTop: "-10px", // hilangkan jarak bawah header
          marginBottom: "5px", // tambahkan jarak bawah header
        },
      }}
      title={
        <Group spacing="xs" align="center">
          <ThemeIcon color="blue" variant="light" radius="xl" size="md">
            <IconPencil size={18} />
          </ThemeIcon>
          <Text fw={600} fz="xl">
            Edit User Akses
          </Text>
        </Group>
      }
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Autocomplete
          label="Nippos"
          data={nipposOptions}
          value={form.values.nippos}
          placeholder="Masukkan nippos"
          onChange={(value) => {
            form.setFieldValue("nippos", value);
            handleSearch(value); // ini memicu fetch API
          }}
        />
        <Switch
          label={form.values.statusUserAkses ? "Aktif" : "Tidak Aktif"}
          checked={form.values.statusUserAkses}
          onChange={(event) =>
            form.setFieldValue("statusUserAkses", event.currentTarget.checked)
          }
          mt="md"
        />
        {/* // Switch untuk mengubah status aktif user akses.
        // Mantine butuh checked (boolean) dan onChange untuk mengubah nilai statusUserAkses. */}

        <Group mt="md" position="center">
          <Button variant="default" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            styles={{
              root: {
                backgroundColor: "#1C2D5A",
                "&:hover": { backgroundColor: "#162447" },
              },
            }}
          >
            Simpan
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
