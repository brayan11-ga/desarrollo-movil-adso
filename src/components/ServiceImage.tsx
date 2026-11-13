import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme";

interface ServiceImageProps {
  uri: string;
  name: string;
  height: number;
}

export default function ServiceImage({ uri, name, height }: ServiceImageProps) {
  if (!uri.trim()) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Text style={styles.caption}>Sin imagen</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: "100%", height }}
      resizeMode="cover"
      accessibilityLabel={name}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  caption: { color: COLORS.textSecondary },
});
