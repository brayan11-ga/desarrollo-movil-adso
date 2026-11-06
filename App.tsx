
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import RootNavigator from "./src/navigation/RootNavigator";
import { useFavoritesStore } from "./src/stores/favoritesStore";
import { COLORS, SPACING, TYPOGRAPHY } from "./src/theme";

export default function App() {
  const [isHydrated, setIsHydrated] = useState(
    useFavoritesStore.persist.hasHydrated()
  );

  const [hydrationError, setHydrationError] = useState(false);

  useEffect(() => {
    const unsubscribe =
      useFavoritesStore.persist.onFinishHydration(() => {
        setIsHydrated(true);
        setHydrationError(false);
      });

    if (useFavoritesStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        {hydrationError ? null : (
          <ActivityIndicator
            accessibilityLabel="Cargando favoritos"
            color={COLORS.primary}
            size="large"
          />
        )}

        <Text accessibilityRole="alert" style={styles.loadingText}>
          {hydrationError
            ? "No pudimos recuperar tus favoritos. Vuelve a intentarlo."
            : "Cargando favoritos…"}
        </Text>

        {hydrationError ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setHydrationError(false);
              void useFavoritesStore.persist.rehydrate();
            }}
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
