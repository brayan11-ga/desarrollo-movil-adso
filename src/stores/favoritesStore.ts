import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesStore {
  // Se guarda en el teléfono.
  favoriteIds: string[];
  // Temporal: indica si ya se leyó AsyncStorage. No se guarda.
  _hasHydrated: boolean;

  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      _hasHydrated: false,

      // Agrega el id solo si todavía no está (evita duplicados).
      addFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds
            : [...state.favoriteIds, id],
        })),

      // Deja todos los ids menos el que queremos quitar.
      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id
          ),
        })),

      // Responde si un servicio está guardado. `get` lee el estado actual.
      isFavorite: (id) => get().favoriteIds.includes(id),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "cleanpro-favorites",
      storage: createJSONStorage(() => AsyncStorage),

      // Solo guardamos los favoritos; _hasHydrated es temporal.
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),

      // Se ejecuta cuando persist termina de leer AsyncStorage.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);