
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ItemCard from "../components/ItemCard";
import { services } from "../data/mockData";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>CleanPro</Text>

        <Text style={styles.title}>
          Servicios de limpieza
        </Text>

        <Text style={styles.subtitle}>
          Espacios limpios, tranquilidad para ti.
        </Text>
      </View>

      <View style={styles.list}>
        {services.map((service) => (
          <ItemCard key={service.id} service={service} />
        ))}
      </View>

      <Text style={styles.footer}>
        Calidad y confianza en cada espacio.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6F4",
  },
  header: {
    backgroundColor: "#153E35",
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  brand: {
    color: "#A7F3D0",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#D1E7DF",
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 28,
  },
});
