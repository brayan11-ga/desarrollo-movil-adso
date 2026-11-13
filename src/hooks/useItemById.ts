import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../services/servicesApi";

// Consulta un servicio cuando la pantalla recibe su ID.
export function useItemById(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => getServiceById(id),
    enabled: id.length > 0,
  });
}
