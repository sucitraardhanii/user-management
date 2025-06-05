import { create } from 'zustand'; // fungsi utama untuk membuat store Zustand
import { persist } from 'zustand/middleware'; // middleware untuk menyimpan data ke localstorage

export const useAppStore = create(
  persist(
    (set) => ({
      apps: [],

      // fetchApps: async() => {
      //   try {
      //     const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/apps');
      //     const data = await res.json();
      //     set({apps: data});
      //   } catch (err) {
      //     console.error("Gagal memuat data aplikasi:", err);
      //   }
      //  },

      addApp: (newApp) =>
        set((state) => ({
          apps: [...state.apps, { ...newApp, id: Date.now() }],
        })),

      updateApp: (id, updatedApp) =>
        set((state) => ({
          apps: state.apps.map((app) =>
            app.id === id ? { ...app, ...updatedApp } : app
          ), // loop semua app jika app.id === id, maka update dan sisanya dibiarkan
        })),

      deleteApp: (id) =>
        set((state) => ({
          apps: state.apps.filter((app) => app.id !== id),
        })), // filter() hanya menyisakan app yang id !== id
    }),
    
    {
      name: 'app-storage', // nama key di localStorage
      partialize: (state) => ({apps: state.apps}),
    }
  )
);
// zustand menyimpan data ke localstorage dengan key user-storage
// jadi saat browser di refresh, data akan tetap ada dan langsung dipulihkan
// apabila data ingin disimpan ke server bukan localstorage, tinggal ganti fungsi2 jadi fetch/axios.