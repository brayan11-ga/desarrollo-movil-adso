import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import RootNavigator from "./src/navigation/RootNavigator";
import { useFavoritesStore } from "./src/stores/favoritesStore";
import { COLORS, SPACING, TYPOGRAPHY } from "./src/theme";

export default function App() {
  // true cuando ya se leyeron los favoritos guardados en el teléfono.
  const hasHydrated = useFavoritesStore((state) => state._hasHydrated);

  // Esperamos la lectura para no mostrar corazones ni badge incorrectos.
  if (!hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          accessibilityLabel="Cargando favoritos"
          color={COLORS.primary}
          size="large"
        />
        <Text style={styles.loadingText}>Cargando favoritos…</Text>
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
});