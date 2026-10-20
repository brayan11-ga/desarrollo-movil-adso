# CleanPro

CleanPro es una aplicación móvil de ejemplo para consultar servicios de una empresa de limpieza. Esta entrega integra la lista virtualizada y la búsqueda de la semana 2 sobre la pantalla existente.

## Dominio

Empresa de limpieza residencial y comercial. El catálogo muestra servicios, categorías, descripciones, precios estimados en pesos colombianos y duración aproximada.

## Funcionalidades

- Catálogo de 12 servicios ficticios en una lista `FlatList`.
- Búsqueda inmediata por nombre, descripción y categoría.
- Búsqueda sin distinguir mayúsculas ni tildes.
- Botón para limpiar la consulta y restaurar todos los servicios.
- Mensaje personalizado cuando no hay coincidencias.
- Ajuste de pantalla para el teclado y opción de cerrarlo al enviar o desplazar la lista.
- Tarjetas reutilizables con categoría, descripción, precio estimado y duración.

## Tecnologías

- Expo `~57.0.30`
- React `19.2.3`
- React Native `0.86.3`
- TypeScript `~6.0.3` con modo estricto
- `pnpm` como gestor de paquetes

## Instalación y ejecución

Desde la carpeta que contiene `package.json` (raíz de este proyecto):

```bash
pnpm install
pnpm start
```

Después, abre el proyecto con Expo Go o un emulador. También puedes usar `pnpm android`, `pnpm ios` (requiere macOS y Xcode) o `pnpm web`.

## Pantalla y decisiones de diseño

La pantalla principal conserva la identidad de CleanPro de la semana 1: encabezado verde oscuro, fondo claro y tarjetas blancas. El encabezado de bienvenida y el campo de búsqueda están en la cabecera de `FlatList`, para que formen parte del mismo desplazamiento que el catálogo. Los colores, tamaños de texto y espacios reutilizables viven en `src/theme/index.ts`.

El catálogo usa datos locales fijos, así que la pantalla no ofrece recarga de datos.

## Comprobación de semana 2

- [x] `FlatList` con 12 servicios y `keyExtractor` basado en `id`.
- [x] `renderItem`, separador y mensaje vacío personalizado.
- [x] Búsqueda en tiempo real por nombre, descripción y categoría.
- [x] Consulta insensible a mayúsculas y tildes, con control para limpiarla.
- [x] `ItemCard` muestra más de tres campos relevantes.
- [x] `KeyboardAvoidingView` con comportamiento según plataforma.
- [x] `useMemo` para filtrar y `useCallback` para renderizar tarjetas, separador y estado vacío.
- [x] Tipos explícitos y configuración TypeScript estricta; sin `any` añadido.
- [x] Tema centralizado con `COLORS`, `TYPOGRAPHY` y `SPACING`.

## Capturas de evidencia

No se incluyen capturas porque no se ejecutó la app en un dispositivo o emulador. Al ejecutar la aplicación, crea `evidencias/` dentro de esta carpeta y guarda allí:

1. `evidencias/lista-servicios.png`: pantalla inicial con el catálogo.
2. `evidencias/busqueda.png`: consulta escrita y resultados filtrados.
3. `evidencias/sin-resultados.png`: consulta sin coincidencias y mensaje vacío.

Puedes insertar cada imagen en esta sección con Markdown después de tomarlas.
