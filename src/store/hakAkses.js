import { create } from "zustand";
import { fetchHakAkses } from "@/lib/api";

export const useHakAkses = create((set, get) => ({
  akses: [],
  fetchHakAkses: async () => {
    try {
      const data = await fetchHakAkses();
      const mapped = data.map((item, index) => ({
        id: index + 1,
        namaAkses: item.namaAkses,
        namaAplikasi: item.namaAplikasi,
        statusAktif: item.statusAktif,
      }));
      set({ akses: mapped });
    } catch (err) {
      console.error("Gagal fetch hak akses:", err);
    }
  },
  deleteAkses: (id) => {
    const updated = get().akses.filter((a) => a.id !== id);
    set({ akses: updated });
  },
}));
