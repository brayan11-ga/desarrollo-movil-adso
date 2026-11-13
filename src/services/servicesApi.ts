import { apiClient } from "./api";
import type { Service } from "../types";
import type { ServiceFormData } from "../schemas/serviceSchema";

export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<Service[]>("/services");
  return response.data;
}

export async function getServiceById(id: string): Promise<Service> {
  const response = await apiClient.get<Service>(`/services/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createService(payload: ServiceFormData): Promise<Service> {
  const response = await apiClient.post<Service>("/services", payload);
  return response.data;
}
