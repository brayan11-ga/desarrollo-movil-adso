
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  image: string;
}

// MockAPI asigna el ID cuando guarda el servicio.
export type CreateServicePayload = Omit<Service, "id">;
