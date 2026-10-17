
import { StyleSheet, Text, View } from "react-native";
import type { Service } from "../types";

interface ItemCardProps {
  service: Service;
}

export default function ItemCard({ service }: ItemCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{service.name}</Text>

      <Text style={styles.description}>
        {service.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          ${service.price.toLocaleString("es-CO")}
        </Text>

        <Text style={styles.duration}>
          {service.duration}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
