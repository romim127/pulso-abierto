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

- **Repositorio fuente:** https://github.com/romim127/pulso-abierto
- **Rama de producción:** `main`
- **Commit inicial publicado:** `bfe2cf46110de0fc0ad519b1a73918c77ad7e969`
- **Aplicación publicada:** https://pulso-abierto-omega.vercel.app/
- **Plataforma:** Vercel · framework Vite · comando `npm run build` · salida `dist/`.

`vercel.json` define `npm run build`, `dist` como salida y un fallback SPA a
`index.html` para rutas directas de React Router. El despliegue fue confirmado
por la pantalla **Deployed to Production** de Vercel (25/11/2026, ART).

La aplicación se comprobó posteriormente en el dominio público: se mostraron
las tres cotizaciones y se abrió y recargó correctamente la ruta directa de
Bitcoin. Permanecen por registrar, de forma independiente, las pruebas de
persistencia de favoritos tras recarga, validación del formulario, consola y
vista móvil en producción.

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
- GitHub: publicado en `romim127/pulso-abierto`, rama `main`. Se verificó el
  push del commit `bfe2cf4` y que se incluyeran los archivos fuente, pruebas,
  configuración y documentación, excluyendo dependencias y archivos temporales.
- Vercel: despliegue de producción confirmado por la interfaz de Vercel;
  URL https://pulso-abierto-omega.vercel.app/ (aportada tras seleccionar Visit).
  En capturas de producción del 25/11/2026 se verificaron las tres cotizaciones
  visibles (Bitcoin, Ethereum y Solana) y la recarga directa exitosa de
  `/criptomonedas/bitcoin` sin retorno inesperado al inicio ni error 404.
  Aún no se registra como confirmada la persistencia del favorito luego de
  recargar ni el resto de controles de producción.
- Fecha de verificación: 25 de noviembre de 2026.
