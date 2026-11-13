import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/servicesApi";

// Consulta el catálogo y comparte el resultado entre Inicio y Favoritos.
export function useItems() {
  return useQuery({ queryKey: ["services"], queryFn: getServices });
}
