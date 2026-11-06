
import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://jsonplaceholder.typicode.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
