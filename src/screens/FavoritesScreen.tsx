
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ItemCard from "../components/ItemCard";
import type { Service } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import { services } from "../data/mockData";
import type { RootTabParamList } from "../navigation/types";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const { favoriteIds } = useFavorites();

  const favoriteServices = services.filter((service) =>
    favoriteIds.includes(service.id),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis servicios favoritos</Text>

      <Text style={styles.subtitle}>
        Aquí encontrarás los servicios que guardaste.
      </Text>

      {favoriteServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Aún no tienes favoritos
          </Text>

          <Text style={styles.emptyText}>
            Explora los servicios y pulsa “Agregar a favoritos”
            en el detalle de los que te interesen.
          </Text>
        </View>
      ) : (
        <FlatList<Service>
          data={favoriteServices}
          keyExtractor={(item: Service) => item.id}
          renderItem={({ item }: { item: Service }) => (
            <ItemCard
            service={item}
            onPress={() =>
            navigation.navigate("Home", {
            screen: "HomeDetail",
            params: {
            id: item.id,
            name: item.name,
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
