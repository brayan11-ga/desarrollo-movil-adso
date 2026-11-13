import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService } from "../services/servicesApi";

// Guarda el servicio y actualiza el catálogo si el servidor confirma la creación.
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
}
