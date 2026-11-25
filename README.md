# Pulso Abierto v4

Aplicación web responsiva para consultar cotizaciones en USD de Bitcoin,
Ethereum y Solana. Está construida con React, Vite, TypeScript, React Router,
Zustand y Zod. Los precios se obtienen de CoinGecko y los favoritos se comparten
entre el listado y el detalle, con persistencia local.

## Requisitos

- Node.js LTS
- npm

## Instalación y desarrollo

Desde la raíz del proyecto:

```bash
npm.cmd ci
npm.cmd run dev
```

Vite muestra la dirección local en la terminal.

## Pruebas y producción

```bash
npm.cmd run check
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd run preview
```

`preview` sirve la compilación ya generada en `dist/`; ejecutá primero
`npm.cmd run build`. Las pruebas de servicio y componentes usan respuestas
deterministas y no llaman a CoinGecko.

## Funcionalidad y rutas

- `/`: formulario controlado, validación Zod, consulta, filtros y favoritos.
- `/criptomonedas/:id`: detalle consultable directamente y favorito compartido.
- Cualquier otra ruta muestra la página 404.

El servicio `src/services/coingecko.ts` aísla la API pública. Zustand almacena
únicamente los IDs favoritos; la carga, los errores y los resultados siguen
locales o derivados. No se requieren variables de entorno para ejecutar la
aplicación.

## Mejora de mantenibilidad V4

El mismo mapa de íconos de Bitcoin, Ethereum y Solana estaba duplicado entre la
tarjeta del listado y la página de detalle. Se centralizó en
`src/constants/crypto.ts` y ambas vistas ahora lo reutilizan. Se conservaron los
símbolos existentes y se agregó una prueba para evitar regresiones; se ejecutó
la suite para validar el cambio.

## GitHub y Vercel

No se ha vinculado ni publicado un repositorio remoto. El destino de GitHub y el
despliegue público quedan pendientes de autorización. No hay una URL pública
confirmada todavía.

`vercel.json` define `npm run build`, `dist` como salida y un fallback SPA a
`index.html` para que las rutas de React Router puedan abrirse y recargarse.

## Verificación final

- `npm.cmd run check`: correcto.
- `npm.cmd run lint`: correcto.
- `npm.cmd run test`: 4 archivos y 8 pruebas aprobadas.
- `npm.cmd run build`: correcto; Vite generó `dist/`. Rollup informó dos
  advertencias no bloqueantes por anotaciones `@__PURE__` de Zod.
- `npm.cmd run preview -- --host 127.0.0.1`: comprobado en el navegador sobre
  el build compilado, no sobre el servidor de desarrollo.
- La consulta real a CoinGecko devolvió tres cotizaciones. Con respuestas
  deterministas en las verificaciones siguientes se comprobaron validación,
  filtros, favorito compartido y persistido después de recargar, ruta de
  detalle directa y recargada, 404, estados simulado inicial/carga/vacío/error,
  reintento exitoso, foco visible y vistas de 1365 × 900 y 390 × 844 sin
  desbordamiento horizontal.
- Durante la consulta real no se observaron errores de ejecución de página.
- GitHub: pendiente de vincular con el repositorio destino autorizado; no hay
  remoto configurado ni se hizo push.
- Vercel: pendiente de aprobación y despliegue; no se creó un proyecto público
  ni se inventó una URL.
- Fecha de verificación: 25 de noviembre de 2026.
