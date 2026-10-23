# CleanPro

CleanPro es una aplicación móvil de ejemplo para consultar servicios de una empresa de limpieza residencial y comercial. Esta entrega amplía el catálogo y la búsqueda de la Semana 2 mediante navegación entre pantallas, visualización de detalles y gestión de servicios favoritos.

## Dominio

Empresa de limpieza residencial y comercial. El catálogo presenta servicios ficticios con categorías, descripciones, precios estimados en pesos colombianos y duración aproximada.

## Funcionalidades

- Catálogo de 12 servicios mediante `FlatList`.
- Búsqueda por nombre, descripción y categoría, sin distinguir mayúsculas ni tildes.
- Limpieza de la consulta y mensaje personalizado cuando no hay resultados.
- Ajuste de pantalla para el teclado.
- Tarjetas reutilizables con información de los servicios.
- Navegación por pestañas entre Inicio y Favoritos.
- Navegación Stack desde el catálogo hasta el detalle de un servicio.
- Envío de `id` y `name` mediante parámetros de navegación tipados.
- Gestión de servicios favoritos mediante un contexto compartido.

## Tecnologías

- Expo SDK `~58.0.17`
- React `19.3.0`
- React Native `0.88.0`
- TypeScript `~6.0.3`
- React Navigation 7
- `@expo/vector-icons`
- `pnpm`

## Instalación y ejecución

Desde la raíz del proyecto, ejecuta:

```bash
pnpm install
pnpm start
```

Abre la aplicación en Expo Go o en un emulador compatible. También puedes utilizar `pnpm android`, `pnpm ios` o `pnpm web`, si estos comandos están configurados en `package.json`.

## Navegación

La aplicación utiliza dos niveles de navegación:

- **Bottom Tabs:** permite cambiar entre Inicio y Favoritos.
- **Native Stack:** permite navegar desde el catálogo hasta el detalle de un servicio.

La navegación se encuentra tipada mediante `RootTabParamList` y `HomeStackParamList`, evitando el uso innecesario de `any`.

## Pantallas

### Inicio

Presenta el catálogo de servicios y la búsqueda. Cada servicio permite acceder a su pantalla de detalle.

### Detalle del servicio

Muestra la información del servicio seleccionado y recibe su identificador y nombre mediante parámetros tipados.

### Favoritos

Permite consultar y gestionar los servicios favoritos mediante el contexto compartido `FavoritesContext`.

## Diseño y estructura

La interfaz conserva la identidad visual de CleanPro: encabezado verde oscuro, fondo claro y tarjetas blancas. Los colores, tamaños de texto y espacios reutilizables se centralizan en `src/theme/index.ts`.

El catálogo utiliza datos locales de prueba y no requiere conexión a una API externa.

Estructura principal:

```text
src/
├── components/
├── context/
├── data/
├── navigation/
├── screens/
└── theme/

screenshots/
├── home.png
├── detail.png
└── favorites.png

App.tsx
README.md
```

## Comprobación de la Semana 3

- [x] Navegación por pestañas entre Inicio y Favoritos.
- [x] Navegación Stack desde el listado hasta el detalle.
- [x] Envío de parámetros `id` y `name`.
- [x] Tipos `RootTabParamList` y `HomeStackParamList`.
- [x] Contexto compartido para gestionar favoritos.
- [x] Integración con el catálogo y la búsqueda de la Semana 2.

## Capturas de evidencia

Las capturas de pantalla se almacenan en la carpeta `screenshots/`, ubicada en la raíz del proyecto.

### Inicio

![Pantalla de Inicio](screenshots/home.png)

### Detalle del servicio

![Detalle del servicio](screenshots/detail.png)

### Favoritos

![Pantalla de Favoritos](screenshots/favorites.png)
