import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../theme";

interface ServiceQueryStatusProps {
  message: string;
  onRetry?: () => void;
}

// Durante la carga muestra el indicador. Si hubo un error, permite reintentar.
export default function ServiceQueryStatus({ message, onRetry }: ServiceQueryStatusProps) {
  return (
    <View style={styles.container}>
      {!onRetry && <ActivityIndicator size="large" color={COLORS.primary} />}
      <Text accessibilityLiveRegion="polite">{message}</Text>
      {onRetry && <Button title="Reintentar" onPress={onRetry} color={COLORS.primary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: SPACING.xl, gap: SPACING.md },
});
