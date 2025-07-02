import { showNotification } from "@mantine/notifications";

// Handler umum untuk response dari API
export function handleApiResponse(result, router, options = {}) {
  const {
    successMessage = null, // opsional, string untuk notif sukses
    silent = false,        // jika true, tidak munculkan notifikasi
  } = options;

  if (result.error === "invalid_token") {
  showNotification({
    title: "Token tidak valid",
    message: "Silakan refresh browser atau login kembali.",
    color: "red",
  });
  return false;
}


  if (result.error === "not_found") {
    showNotification({
      title: "Data tidak ditemukan",
      message: "Periksa kembali parameter pencarian.",
      color: "orange",
    });
    return false;
  }

  if (result.error === "network_error") {
    showNotification({
      title: "Gagal terhubung ke server",
      message: result.detail || "Silakan coba beberapa saat lagi.",
      color: "red",
    });
    return false;
  }

  if (!result.data) {
    showNotification({
      title: "Error tidak diketahui",
      message: "Respons tidak mengandung data yang diharapkan.",
      color: "red",
    });
    return false;
  }

  if (successMessage && !silent) {
    showNotification({
      title: "Berhasil",
      message: successMessage,
      color: "green",
    });
  }

  return true;
}
