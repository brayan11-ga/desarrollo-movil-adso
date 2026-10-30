
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesStore {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id) => {
        const currentIds = get().favoriteIds;

        if (currentIds.includes(id)) {
          set({
            favoriteIds: currentIds.filter(
              (favoriteId) => favoriteId !== id
            ),
          });
        } else {
          set({
            favoriteIds: [...currentIds, id],
          });
        }
      },

      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: "cleanpro-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
