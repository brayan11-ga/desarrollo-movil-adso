
import { useRoute, type RouteProp } from "@react-navigation/native";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { PressableStateCallbackType } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import type { HomeStackParamList } from "../navigation/types";
import { services } from "../data/mockData";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";

type DetailRouteProp = RouteProp<HomeStackParamList, "HomeDetail">;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { id, name } = route.params;

  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const service = services.find((item) => item.id === id);

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Servicio no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={service.image}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={service.name}
      />

      <View style={styles.content}>
        <Text style={styles.category}>{service.category}</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{service.description}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? "Quitar de favoritos" : "Agregar a favoritos"
          }
          accessibilityState={{ selected: favorite }}
          onPress={() => toggleFavorite(id)}
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
  image: {
    width: "100%",
    height: 250,
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
