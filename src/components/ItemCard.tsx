
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Service } from "../types";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";

interface ItemCardProps {
  service: Service;
}

export default function ItemCard({ service }: ItemCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => {
        console.log(`Servicio seleccionado: ${service.name}`);
      }}
    >
      <Image
        source={service.image}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={service.name}
      />

      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.name}>{service.name}</Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.category}>{service.category}</Text>
          </View>
        </View>

        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Precio estimado</Text>
            <Text style={styles.price}>
              ${service.price.toLocaleString("es-CO")}
            </Text>
          </View>

          <Text style={styles.duration}>{service.duration}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: 170,
  },
  content: {
    padding: SPACING.card,
  },
  heading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  name: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.heading,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  categoryBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  category: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.caption,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  description: {
    fontSize: TYPOGRAPHY.size.body,
    lineHeight: TYPOGRAPHY.lineHeight.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    color: COLORS.muted,
    fontSize: TYPOGRAPHY.size.caption,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: TYPOGRAPHY.size.heading,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  duration: {
    fontSize: TYPOGRAPHY.size.small,
    color: COLORS.textSecondary,
  },
});
