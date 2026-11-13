
import { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../navigation/types";
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from "react-native";
import ItemCard from "../components/ItemCard";
import ServiceQueryStatus from "../components/ServiceQueryStatus";
import { useItems } from "../hooks/useItems";
import type { Service } from "../types";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";
import { useFavoritesStore } from "../stores/favoritesStore";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList, "HomeList">>();

  // Cada selector suscribe únicamente los IDs o la acción que necesita la pantalla.
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const [searchText, setSearchText] = useState("");
  const { data, isLoading, isError, isFetching, refetch } = useItems();

  const filteredServices = useMemo(() => {
    const services = data ?? [];
    const query = normalizeSearch(searchText);

    if (query.length === 0) {
      return services;
    }

    return services.filter((service) =>
      [service.name, service.description, service.category].some((field) =>
        normalizeSearch(field).includes(query),
      ),
    );
  }, [data, searchText]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Service>) => (
      <ItemCard
        service={item}
        isFavorite={favoriteIds.includes(item.id)}
        onToggleFavorite={() =>
          favoriteIds.includes(item.id)
            ? removeFavorite(item.id)
            : addFavorite(item.id)
        }
        onPress={() =>
          navigation.navigate("HomeDetail", {
            id: item.id,
            name: item.name,
          })
        }
      />
    ),
    [navigation, favoriteIds, addFavorite, removeFavorite],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmptyState = useCallback(() => {
    const query = searchText.trim();

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No encontramos servicios</Text>
        <Text style={styles.emptyMessage}>
          {query.length > 0
            ? `No hay coincidencias para “${query}”. Prueba otro término o limpia la búsqueda.`
            : "Por ahora no hay servicios disponibles."}
        </Text>
      </View>
    );
  }, [searchText]);

  if (isLoading) {
    return <ServiceQueryStatus message="Cargando servicios…" />;
  }

  if (isError) {
    return (
      <ServiceQueryStatus
        message="No se pudo cargar el catálogo."
        onRetry={() => void refetch()}
      />
    );
  }

  const listHeader = (
    <View>
      <View style={styles.header}>
        <Text style={styles.brand}>CleanPro</Text>
        <Text style={styles.title}>Servicios de limpieza</Text>
        <Text style={styles.subtitle}>
          Espacios limpios, tranquilidad para ti.
        </Text>
      </View>

      <View style={styles.searchSection}>
        <Button
          title="Nuevo servicio"
          color={COLORS.primary}
          onPress={() => navigation.navigate("CreateService")}
        />
        <Text style={styles.searchTitle}>¿Qué necesitas limpiar?</Text>
        <View style={styles.searchField}>
          <TextInput
            accessibilityLabel="Buscar servicios de limpieza"
            autoCapitalize="none"
            clearButtonMode="never"
            onChangeText={setSearchText}
            onSubmitEditing={Keyboard.dismiss}
            placeholder="Busca por servicio o categoría"
            placeholderTextColor={COLORS.placeholder}
            returnKeyType="search"
            style={styles.input}
            value={searchText}
          />
          {searchText.length > 0 ? (
            <Pressable
              accessibilityLabel="Limpiar búsqueda"
              accessibilityRole="button"
              onPress={() => setSearchText("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.resultCount}>
          {filteredServices.length} de {data?.length ?? 0} servicios
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList<Service>
        contentContainerStyle={styles.listContent}
        data={filteredServices}
        extraData={favoriteIds}
        ItemSeparatorComponent={renderSeparator}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item: Service) => item.id}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          <Text style={styles.footer}>
            Calidad y confianza en cada espacio.
          </Text>
        }
        ListHeaderComponent={listHeader}
        onRefresh={refetch}
        refreshing={isFetching}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        renderItem={renderItem}
      />
    </KeyboardAvoidingView>
  );
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: SPACING.section,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.heroTop,
    paddingBottom: SPACING.heroBottom,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  brand: {
    color: COLORS.primarySoft,
    fontSize: TYPOGRAPHY.size.subtitle,
    fontWeight: TYPOGRAPHY.weight.bold,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.onPrimary,
    fontSize: TYPOGRAPHY.size.title,
    fontWeight: TYPOGRAPHY.weight.heavy,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.subtitle,
    fontSize: TYPOGRAPHY.size.subtitle,
    lineHeight: TYPOGRAPHY.lineHeight.subtitle,
  },
  searchSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.section,
    paddingBottom: SPACING.lg,
  },
  searchTitle: {
    marginTop: SPACING.lg,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.heading,
    fontWeight: TYPOGRAPHY.weight.bold,
    marginBottom: SPACING.md,
  },
  searchField: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
  },
  input: {
    flex: 1,
    minHeight: 50,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.subtitle,
  },
  clearButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  clearButtonText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.size.small,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  resultCount: {
    color: COLORS.muted,
    fontSize: TYPOGRAPHY.size.small,
    marginTop: SPACING.sm,
  },
  separator: {
    height: SPACING.md,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.section,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size.heading,
    fontWeight: TYPOGRAPHY.weight.bold,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
    lineHeight: TYPOGRAPHY.lineHeight.body,
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: TYPOGRAPHY.size.small,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});
