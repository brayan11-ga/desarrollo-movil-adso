import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import type { z } from "zod";
import FormField from "../components/FormField";
import { useCreateItem } from "../hooks/useCreateItem";
import type { HomeStackParamList } from "../navigation/types";
import { serviceSchema, type ServiceFormData } from "../schemas/serviceSchema";
import { COLORS, SPACING } from "../theme";

type CreateScreenProps = NativeStackScreenProps<HomeStackParamList, "CreateService">;

export default function CreateScreen({ navigation }: CreateScreenProps) {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<
    z.input<typeof serviceSchema>,
    unknown,
    z.output<typeof serviceSchema>
  >({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      image: "",
    },
  });
  const { mutateAsync, isPending, error } = useCreateItem();
  const isSaving = isSubmitting || isPending;

  async function onSubmit(data: ServiceFormData) {
    try {
      await mutateAsync(data, {
        onSuccess: () => {
          if (Platform.OS === "web") {
            window.alert("Servicio creado.");
          } else {
            Alert.alert("Servicio creado.");
          }
          navigation.goBack();
        },
      });
    } catch {
      // useCreateItem conserva el error del servidor; los campos mantienen su contenido.
      return;
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <FormField control={control} name="name" label="Nombre (obligatorio)" />
        <FormField control={control} name="description" label="Descripción (opcional)" multiline />
        <FormField control={control} name="category" label="Categoría (obligatoria)" />
        <FormField control={control} name="price" label="Precio en pesos, solo números (obligatorio)" keyboardType="number-pad" />
        <FormField control={control} name="duration" label="Duración (obligatoria)" placeholder="Ejemplo: 2 horas" />
        <FormField control={control} name="image" label="URL de imagen (opcional)" autoCapitalize="none" autoCorrect={false} keyboardType="url" />
        {error && (
          <Text accessibilityRole="alert" style={styles.error}>
            No se pudo guardar el servicio. {error.message}
          </Text>
        )}
        {isSaving && <ActivityIndicator color={COLORS.primary} accessibilityLabel="Guardando servicio" />}
        <Button
          title={isSaving ? "Guardando…" : "Guardar servicio"}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSaving}
          color={COLORS.primary}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: SPACING.xl, gap: SPACING.sm },
  error: { color: COLORS.error },
});
