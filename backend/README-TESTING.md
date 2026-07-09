Two Blondes — Test server & sync

Objetivo
-------
Proveer un servidor de desarrollo ligero que arranque sin MongoDB y ofrezca endpoints file-backed para probar la sincronización del frontend (`/api/cart`, `/api/notes`).

Arranque rápido
---------------
1. Abrir PowerShell o terminal en la carpeta `backend`.
2. Instalar dependencias (si no están instaladas):

```powershell
cd c:\Users\User\Downloads\Two BlondesStudio\backend
npm install
```

3. Iniciar el servidor (arranca aunque no exista `MONGODB_URI`):

```powershell
node server.js
# o para modo de test rápido
node server_test.js
```

Endpoints disponibles
---------------------
- `GET /api/cart` — devuelve el carrito guardado (array).
- `POST /api/cart` — guarda el carrito (payload JSON: `{ cart: [...] }`).
- `GET /api/notes` — devuelve notas de clientes (objeto).
- `POST /api/notes` — guarda notas (payload JSON: `{ notes: { ... } }`).

Los datos se persisten en `backend/tb_cart.json` y `backend/tb_notes.json`.

Frontend
--------
Abrir `http://localhost:3000` (o `:3002` si usas `server_test.js`) y probar: añadir productos, escribir notas y comprobar `tb_cart.json` y `tb_notes.json` para verificar la sincronización.

Helpers
-------
- `window.TBSystem` y `window.testTwoBlondesSystem()` disponibles desde la consola para simulaciones.

Notas
-----
Este servidor de pruebas está pensado solo para desarrollo local. Para producción, integrar la lógica en `server.js` con persistencia en MongoDB o el sistema definitivo de la plataforma.
