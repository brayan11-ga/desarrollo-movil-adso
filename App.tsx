
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import RootNavigator from "./src/navigation/RootNavigator";
import { useFavoritesStore } from "./src/stores/favoritesStore";
import { COLORS, SPACING, TYPOGRAPHY } from "./src/theme";

export default function App() {
  const hydrationStatus = useFavoritesStore((state) => state.hydrationStatus);

  // Esperamos la lectura para no mostrar corazones, listas o badges incorrectos.
  if (hydrationStatus !== "ready") {
    return (
      <View style={styles.loadingContainer}>
        {hydrationStatus === "loading" ? (
          <ActivityIndicator
            accessibilityLabel="Cargando favoritos"
            color={COLORS.primary}
            size="large"
          />
        ) : null}
        <Text accessibilityRole="alert" style={styles.loadingText}>
          {hydrationStatus === "error"
            ? "No pudimos recuperar tus favoritos. Vuelve a intentarlo."
            : "Cargando favoritos…"}
        </Text>
        {hydrationStatus === "error" ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => void useFavoritesStore.persist.rehydrate()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.body,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  retryText: {
    color: COLORS.onPrimary,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});
