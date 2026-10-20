
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Service } from "../types";

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
        <Text style={styles.name}>{service.name}</Text>

        <Text style={styles.description}>
          {service.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            ${service.price.toLocaleString("es-CO")}
          </Text>

          <Text style={styles.duration}>{service.duration}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    padding: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17202A",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#5B6573",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#16804A",
  },
  duration: {
    fontSize: 13,
    color: "#5B6573",
  },
});
