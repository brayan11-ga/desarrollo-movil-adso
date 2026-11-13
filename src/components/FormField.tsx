import { Controller, type Control } from "react-hook-form";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import type { z } from "zod";
import { serviceSchema, type ServiceFormData } from "../schemas/serviceSchema";
import { COLORS, SPACING } from "../theme";

type FormFieldProps = {
  control: Control<z.input<typeof serviceSchema>, unknown, ServiceFormData>;
  name: keyof ServiceFormData;
  label: string;
} & Pick<TextInputProps, "placeholder" | "keyboardType" | "multiline" | "autoCapitalize" | "autoCorrect">;

// Conecta un campo al formulario y muestra debajo el error que devuelve Zod.
export default function FormField({ control, name, label, ...inputProps }: FormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            {...inputProps}
            ref={field.ref}
            accessibilityLabel={label}
            style={[styles.input, fieldState.error && styles.inputError]}
            placeholderTextColor={COLORS.placeholder}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChangeText={(text) => {
              // El precio se escribe solo con dígitos; Zod valida su valor al enviar.
              field.onChange(name === "price" ? text.replace(/\D/g, "") : text);
            }}
          />
          {fieldState.error && (
            <Text accessibilityRole="alert" style={styles.error}>
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  field: { gap: SPACING.xs, marginBottom: SPACING.sm },
  label: { color: COLORS.text },
  input: {
    minHeight: 44,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
  },
  inputError: { borderColor: COLORS.error },
  error: { color: COLORS.error },
});
