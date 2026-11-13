
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ItemCard from "../components/ItemCard";
import ServiceQueryStatus from "../components/ServiceQueryStatus";
import { useItems } from "../hooks/useItems";
import type { Service } from "../types";
import { useFavoritesStore } from "../stores/favoritesStore";
import { services as previousServices } from "../data/mockData";
import type { RootTabParamList } from "../navigation/types";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const { data, isLoading, isError, refetch } = useItems();

  // Resolvemos los IDs contra el catálogo sin duplicar objetos en el store.
  const previousFavorites = previousServices.filter((service) =>
    favoriteIds.includes(service.id),
  );
  const apiFavorites = (data ?? []).filter((service) =>
    favoriteIds.includes(service.id),
  );
  const favoriteServices = [...apiFavorites, ...previousFavorites];
  const hasApiFavorites = favoriteIds.length > previousFavorites.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis servicios favoritos</Text>

      <Text style={styles.subtitle}>
        Aquí encontrarás los servicios que guardaste.
      </Text>

      {hasApiFavorites && isLoading && <ServiceQueryStatus message="Cargando favoritos…" />}
      {hasApiFavorites && isError && (
        <ServiceQueryStatus
          message="No se pudieron consultar los servicios favoritos."
          onRetry={() => void refetch()}
        />
      )}
      {favoriteServices.length === 0 && !(hasApiFavorites && (isLoading || isError)) ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Aún no tienes favoritos
          </Text>

          <Text style={styles.emptyText}>
            Explora los servicios y pulsa el corazón de una tarjeta o
            “Agregar a favoritos” en el detalle de los que te interesen.
          </Text>
        </View>
      ) : (
        <FlatList<Service>
          data={favoriteServices}
          extraData={favoriteIds}
          keyExtractor={(item: Service) => item.id}
          renderItem={({ item }: { item: Service }) => (
            <ItemCard
              service={item}
              isFavorite={true}
              onToggleFavorite={() => removeFavorite(item.id)}
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "HomeDetail",
                  params: {
                    id: item.id,
                  },
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.title,
    fontWeight: TYPOGRAPHY.weight.bold,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
    marginBottom: SPACING.lg,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.heading,
    fontWeight: TYPOGRAPHY.weight.bold,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
    lineHeight: TYPOGRAPHY.lineHeight.body,
    textAlign: "center",
  },
});
