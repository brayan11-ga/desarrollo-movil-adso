
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesStore {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favoriteIds: [],

      addFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds
            : [...state.favoriteIds, id],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id
          ),
        })),
    }),
    {
      name: "cleanpro-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
