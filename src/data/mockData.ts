
import type { Service } from "../types";

export const services: Service[] = [
  {
    id: "1",
    name: "Limpieza del hogar",
    description: "Limpieza general de habitaciones, baños, cocina y zonas comunes.",
    price: 80000,
    duration: "3 horas",
    image: require("../../assets/services/limpieza-hogar.jpg"),
  },
  {
    id: "2",
    name: "Limpieza de oficinas",
    description: "Limpieza de escritorios, salas de reuniones y espacios de trabajo.",
    price: 120000,
    duration: "4 horas",
    image: require("../../assets/services/limpieza-oficinas.jpg"),
  },
  {
    id: "3",
    name: "Limpieza profunda",
    description: "Limpieza detallada para eliminar la suciedad acumulada.",
    price: 150000,
    duration: "5 horas",
    image: require("../../assets/services/limpieza-profunda.jpg"),
  },
  {
    id: "4",
    name: "Limpieza de ventanas",
    description: "Limpieza de vidrios y ventanas para dejarlos libres de manchas.",
    price: 60000,
    duration: "2 horas",
    image: require("../../assets/services/limpieza-ventanas.jpg"),
  },
];
