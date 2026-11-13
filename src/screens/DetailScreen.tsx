
import { useRoute, type RouteProp } from "@react-navigation/native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { PressableStateCallbackType } from "react-native";
import ServiceImage from "../components/ServiceImage";
import ServiceQueryStatus from "../components/ServiceQueryStatus";
import { useItemById } from "../hooks/useItemById";
import { useFavoritesStore } from "../stores/favoritesStore";
import type { HomeStackParamList } from "../navigation/types";
import { services as previousServices } from "../data/mockData";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";

type DetailRouteProp = RouteProp<HomeStackParamList, "HomeDetail">;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;

  const favorite = useFavoritesStore((state) => state.favoriteIds.includes(id));
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  // Los favoritos de semana 04 tienen IDs locales que MockAPI no conoce.
  const previousService = previousServices.find((item) => item.id === id);
  const { data, isLoading, isError, refetch } = useItemById(previousService ? "" : id);
  const service = previousService ?? data;

  if (isLoading) {
    return <ServiceQueryStatus message="Cargando servicio…" />;
  }

  if (isError) {
    return (
      <ServiceQueryStatus
        message="No se pudo cargar el detalle del servicio."
        onRetry={() => void refetch()}
      />
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Servicio no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ServiceImage uri={service.image} name={service.name} height={250} />

      <View style={styles.content}>
        <Text style={styles.category}>{service.category}</Text>
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? "Quitar de favoritos" : "Agregar a favoritos"
          }
          accessibilityState={{ selected: favorite }}
          onPress={() => (favorite ? removeFavorite(id) : addFavorite(id))}
          style={({ pressed }: PressableStateCallbackType) => [
            styles.favoriteButton,
            favorite && styles.favoriteButtonActive,
            pressed && styles.favoriteButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.favoriteButtonText,
              favorite && styles.favoriteButtonTextActive,
            ]}
          >
            {favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          </Text>
        </Pressable>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Precio estimado</Text>
          <Text style={styles.price}>
            ${service.price.toLocaleString("es-CO")}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Duración</Text>
          <Text style={styles.value}>{service.duration}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  category: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.small,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.title,
    fontWeight: TYPOGRAPHY.weight.bold,
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
    lineHeight: TYPOGRAPHY.lineHeight.body,
    marginBottom: SPACING.xl,
  },
  favoriteButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  favoriteButtonActive: {
    backgroundColor: COLORS.border,
  },
  favoriteButtonPressed: {
    opacity: 0.75,
  },
  favoriteButtonText: {
    color: COLORS.onPrimary,
    fontSize: TYPOGRAPHY.size.body,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  favoriteButtonTextActive: {
    color: COLORS.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
  },
  price: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.heading,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  value: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.body,
  },
});
