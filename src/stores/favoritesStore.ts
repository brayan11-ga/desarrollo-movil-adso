import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesStore {
  favoriteIds: string[];

  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (id) => {
        if (get().favoriteIds.includes(id)) return;

        set((state) => ({
          favoriteIds: [...state.favoriteIds, id],
        }));
      },

      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id
          ),
        })),

      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: "cleanpro-favorites",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    }
  )
);