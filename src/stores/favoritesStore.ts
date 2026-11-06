
import { create, type StateCreator } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesStore {
  favoriteIds: string[];
  hydrationStatus: "loading" | "ready" | "error";
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}

type PersistedFavorites = Pick<FavoritesStore, "favoriteIds">;

// Zustand conserva los IDs; el catálogo sigue siendo responsable de los servicios.
const createFavoritesState: StateCreator<
  FavoritesStore,
  [],
  [["zustand/persist", PersistedFavorites]]
> = (setHydrationState, get, api) =>
  persist<FavoritesStore, [], [], PersistedFavorites>(
    (set) => ({
      favoriteIds: [],
      hydrationStatus: "loading",

      // Las acciones son inmutables; agregar el mismo ID no duplica favoritos.
      addFavorite: (id) =>
        set((state) =>
          state.favoriteIds.includes(id)
            ? state
            : { favoriteIds: [...state.favoriteIds, id] },
        ),
      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((favoriteId) => favoriteId !== id),
        })),
    }),
    {
      // AsyncStorage recupera los favoritos incluso después de cerrar la app.
      name: "cleanpro-favorites",
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistimos IDs, sin acciones ni estado temporal de hidratación.
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
      onRehydrateStorage: (state) => {
        // El setter original evita escribir en disco al cambiar la hidratación.
        // Así, una lectura fallida no sobrescribe los favoritos guardados.
        if (state.hydrationStatus !== "loading") {
          setHydrationState({ hydrationStatus: "loading" });
        }

        return (_rehydratedState, error) => {
          if (error) {
            console.error("No se pudieron recuperar los favoritos.", error);
          }

          setHydrationState({ hydrationStatus: error ? "error" : "ready" });
        };
      },
    },
  )(setHydrationState, get, api);

export const useFavoritesStore = create<FavoritesStore>()(
  createFavoritesState,
);
