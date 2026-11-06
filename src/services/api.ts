
import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://6aee43a0a677fe0fc14fd3b9.mockapi.io/services";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
