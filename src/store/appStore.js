import { create } from "zustand";
import { fetchAplikasi } from "@/lib/api";

export const useAppStore = create((set, get) => ({
  apps: [],
  fetchApps: async () => {
    try {
      const data = await fetchAplikasi();
      // ubah format key agar cocok dengan table: name, address, status, id
      const mapped = data.map((item) => ({
        id: item.idaplikasi,
        name: item.nama,
        address: item.alamat,
        status: item.status,
      }));
      set({ apps: mapped });
    } catch (err) {
      console.error("Gagal fetch aplikasi:", err);
    }
  },
  deleteApp: (id) => {
    const updated = get().apps.filter((app) => app.id !== id);
    set({ apps: updated });
  },
}));
