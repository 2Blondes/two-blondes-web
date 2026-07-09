PR: feat(ux): Whatsapp reservations, side-cart, auto-sync and test server

Resumen
-------
Este PR introduce una reingeniería UX/JS mínima pero amplia que unifica reservas por WhatsApp, añade un side-cart interactivo, persistencia local y sincronización file-backed para pruebas locales.

Cambios clave
-------------
- Frontend: `public/index.html`
  - Reserva por WhatsApp unificada a `https://wa.me/34621400364?text=...` con mensajes exactos para reservas con/sin nota, VIP y guía de tallas.
  - Side-cart interactivo con contador, modificación de cantidades, borrado de líneas.
  - Persistencia en `localStorage` para `tb_cart` y `tb_notes`.
  - `window.TBSystem` y `window.testTwoBlondesSystem()` disponibles para pruebas desde la consola.
  - Indicador visual `#syncDot` y llamadas `fetch` debounceadas a `/api/cart` y `/api/notes`.

- Backend:
  - `server.js` ahora arranca aunque `MONGODB_URI` no esté configurada y expone endpoints file-backed:
    - `GET/POST /api/cart`
    - `GET/POST /api/notes`
  - Datos persistidos localmente en `backend/tb_cart.json` y `backend/tb_notes.json`.
  - Añadido `server_test.js` (opcional) para desarrollo rápido.

Cómo probar localmente
----------------------
1. Instalar dependencias en `backend` (si hace falta):

```powershell
cd backend
npm install
```

2. Iniciar servidor de pruebas:

```powershell
# recomendado: start:test
npm run start:test
# o
node server.js
```

3. Abrir `http://localhost:3002` (o `:3000` si usas `server.js`) y:
  - Añadir artículos al carrito.
  - Escribir notas de cliente en la ficha y pulsar `Reservar`.
  - Comprobar `backend/tb_cart.json` y `backend/tb_notes.json` para verificar sincronización.
  - Usar `window.testTwoBlondesSystem()` en la consola para simulaciones.

Notas para el reviewer
----------------------
- Este PR crea endpoints de propósito exclusivamente para pruebas locales; para producción se debe mapear la lógica a la base de datos real (Mongo) y añadir autenticación si procede.
- No hay cambios en `server.js` que afecten al comportamiento cuando `MONGODB_URI` está configurada — simplemente evita que el servidor caiga si falta la variable de entorno.

Checklist
---------
- [ ] Probar flujos de reserva WhatsApp (con y sin nota).
- [ ] Verificar que `#syncDot` muestra estados al guardar carrito/notas.
- [ ] Verificar persistencia `localStorage` entre recargas.
- [ ] Revisar accesibilidad básica y comportamientos de modal/escape.

