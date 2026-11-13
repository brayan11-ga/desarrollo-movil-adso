import { apiClient } from "./api";
import type { CreateServicePayload, Service } from "../types";

export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<Service[]>("/services");
  return response.data;
}

export async function getServiceById(id: string): Promise<Service> {
  const response = await apiClient.get<Service>(`/services/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createService(payload: CreateServicePayload): Promise<Service> {
  const response = await apiClient.post<Service>("/services", payload);
  return response.data;
}
