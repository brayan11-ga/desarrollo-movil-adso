import { useState } from "react";
import { Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCreateItem } from "../hooks/useCreateItem";
import type { HomeStackParamList } from "../navigation/types";
import { COLORS, SPACING } from "../theme";

type CreateScreenProps = NativeStackScreenProps<HomeStackParamList, "CreateService">;

export default function CreateScreen({ navigation }: CreateScreenProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [validationError, setValidationError] = useState("");
  const { mutate, isPending, error } = useCreateItem();

  function saveService() {
    if (isPending) return;

    if (!name.trim()) {
      setValidationError("Escribe el nombre del servicio.");
      return;
    }


    const numericPrice = Number(price.replace(/\D/g, ""));
    if (numericPrice <= 0) {
    setValidationError("Escribe un precio mayor que cero.");
    return;
}

    setValidationError("");
    mutate(
      {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: numericPrice,
        duration: duration.trim(),
        image: image.trim(),
      },
      {
        onSuccess: () => {
          if (Platform.OS === "web") {
            window.alert("Servicio creado.");
          } else {
            Alert.alert("Servicio creado.");
          }
          navigation.goBack();
        },
      },
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text>Nombre (obligatorio)</Text>
        <TextInput accessibilityLabel="Nombre" style={styles.input} value={name} onChangeText={setName} />
        <Text>Descripción</Text>
        <TextInput accessibilityLabel="Descripción" style={styles.input} value={description} onChangeText={setDescription} multiline />
        <Text>Categoría</Text>
        <TextInput accessibilityLabel="Categoría" style={styles.input} value={category} onChangeText={setCategory} />
        <Text>Precio en pesos, solo números (obligatorio)</Text>
        <TextInput accessibilityLabel="Precio" style={styles.input} value={price} onChangeText={setPrice} keyboardType="number-pad" />
        <Text>Duración</Text>
        <TextInput accessibilityLabel="Duración" style={styles.input} value={duration} onChangeText={setDuration} />
        <Text>URL de imagen (opcional)</Text>
        <TextInput accessibilityLabel="URL de imagen" style={styles.input} value={image} onChangeText={setImage}
          autoCapitalize="none" autoCorrect={false} keyboardType="url" />
        {validationError ? <Text accessibilityRole="alert">{validationError}</Text> : null}
        {!validationError && error && (
          <Text accessibilityRole="alert">No se pudo guardar el servicio. {error.message}</Text>
        )}
        <Button
          title={isPending ? "Guardando…" : "Guardar servicio"}
          onPress={saveService}
          disabled={isPending}
          color={COLORS.primary}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: SPACING.xl, gap: SPACING.sm },
  input: {
    minHeight: 44,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
  },
});
