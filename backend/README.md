# Two Blondes - Web con backend real

Esta version usa Node.js + MongoDB para que los cambios se publiquen al instante
para todo el mundo, y envia correos de verdad para aprobar el acceso admin.

## Que hace cada pieza

- **MongoDB Atlas**: guarda el contenido de la web (textos, fotos) y las solicitudes de acceso
- **Render**: aloja el servidor Node y lo mantiene funcionando
- **GitHub**: guarda el codigo y conecta con Render para desplegar automaticamente
- **Gmail (twoblondesstudio@gmail.com)**: envia los correos de solicitud/aprobacion
- **VS Code**: donde editas el codigo en tu ordenador

---

## Paso 1 - Subir el proyecto a GitHub

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes
2. Pulsa "New repository", llamalo por ejemplo `two-blondes-web`, dejalo privado o publico, y creado
3. Abre esta carpeta en **VS Code**
4. Abre la terminal integrada de VS Code (`Ctrl+ñ` o menu Terminal > New Terminal) y ejecuta:
   ```
   git init
   git add .
   git commit -m "Primera version"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/two-blondes-web.git
   git push -u origin main
   ```
   (Sustituye `TU_USUARIO` por tu usuario de GitHub. Te pedira iniciar sesion la primera vez)

## Paso 2 - Crear la base de datos en MongoDB Atlas (gratis)

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta gratis
2. Crea un cluster gratuito (M0)
3. En "Database Access", crea un usuario con contraseña (guardala)
4. En "Network Access", pulsa "Add IP Address" y elige "Allow access from anywhere" (0.0.0.0/0) para que Render pueda conectar
5. Pulsa "Connect" > "Drivers", copia la cadena de conexion, sera algo como:
   ```
   mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/
   ```
6. Anadele el nombre de la base de datos al final, por ejemplo:
   ```
   mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/two_blondes
   ```
   Guarda esta URL, la necesitas en el paso 4.

## Paso 3 - Contraseña de aplicacion de Gmail

Gmail no deja usar tu contraseña normal para enviar correos desde codigo. Necesitas
una "contraseña de aplicacion":

1. Entra en la cuenta `twoblondesstudio@gmail.com`
2. Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
3. Activa la verificacion en dos pasos si no la tienes activada (es obligatorio para este paso)
4. Busca "Contraseñas de aplicaciones" (App Passwords), creala para "Correo"
5. Google te da una contraseña de 16 caracteres tipo `abcd efgh ijkl mnop` - guardala,
   la necesitas en el paso 4 (es distinta de tu contraseña normal de Gmail)

## Paso 4 - Desplegar en Render

1. Ve a [render.com](https://render.com) y crea una cuenta (puedes entrar con GitHub directamente)
2. Pulsa "New" > "Web Service"
3. Conecta tu repositorio de GitHub `two-blondes-web`
4. Configuralo asi:
   - **Name**: two-blondes (o el que quieras, sera parte de la URL)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. En "Environment Variables" (o "Environment" en el panel), anade estas (una por una,
   con los valores reales que has ido guardando):

   | Clave | Valor |
   |---|---|
   | `MONGODB_URI` | la cadena de conexion del paso 2 |
   | `EMAIL_USER` | twoblondesstudio@gmail.com |
   | `EMAIL_PASS` | la contraseña de aplicacion del paso 3 |
   | `OWNER_EMAIL` | twoblondesstudio@gmail.com |
   | `MASTER_ADMIN_PASSWORD` | una contraseña vuestra, para entrar siempre sin pasar por email |
   | `JWT_SECRET` | cualquier texto largo y aleatorio, por ejemplo `f8x2kq9z...` (30+ caracteres) |
   | `PUBLIC_URL` | la URL que os de Render, ej `https://two-blondes.onrender.com` (la sabreis tras el primer deploy, podeis actualizarla despues) |
   | `NODE_ENV` | production |

6. Pulsa "Create Web Service". Render instalara todo y arrancara el servidor
   (tarda 2-5 minutos la primera vez)
7. Cuando termine, te dara la URL publica, algo como `https://two-blondes.onrender.com`
8. Entra en esa URL con el navegador para comprobar que carga la web

**Nota sobre el plan gratuito de Render**: el servidor se "duerme" tras 15 minutos sin
visitas y tarda unos segundos en despertar la siguiente vez que alguien entra. Es normal
y no afecta a los datos guardados.

## Paso 5 - Probarlo todo

1. Entra en vuestra URL de Render
2. Pulsa el lapiz (edit) abajo a la derecha
3. Escribe un email de prueba y pulsa "Enviar solicitud" -> deberia llegar un correo a
   `twoblondesstudio@gmail.com` con botones de "Aprobar" / "Rechazar"
4. Pulsa "Aprobar" en ese correo -> le llegara un email al solicitante con una contraseña
5. Con esa contraseña (o con vuestra `MASTER_ADMIN_PASSWORD`), entra en modo edicion desde la web
6. Cambia un texto o sube una foto y pulsa "Guardar cambios (en vivo)"
7. Recarga la pagina (o abrela en otro dispositivo): el cambio ya deberia verse para todo el mundo,
   sin descargar ni subir nada

## Como seguir editando en el futuro

- **Cambiar textos/fotos de la web**: hazlo directamente desde la web en modo edicion,
  no hace falta tocar codigo ni volver a desplegar
- **Cambiar el diseño o añadir funciones nuevas**: edita los archivos en VS Code,
  guarda, y sube los cambios con:
  ```
  git add .
  git commit -m "Descripcion del cambio"
  git push
  ```
  Render detecta el push a GitHub y despliega la nueva version automaticamente en 1-2 minutos

## Estructura del proyecto

```
two-blondes-backend/
  server.js              -> arranca el servidor Express
  models/
    Content.js            -> esquema del contenido de la web
    AccessRequest.js       -> esquema de las solicitudes de acceso admin
  routes/
    content.js             -> API para leer/guardar el contenido
    admin.js                -> API para solicitar/aprobar/rechazar acceso y login
  middleware/
    requireAdmin.js         -> protege las rutas que solo puede usar un admin logueado
  mailer.js                 -> envia los emails (Gmail)
  public/
    index.html               -> la web que ve la gente
  .env.example                -> plantilla de variables de entorno (no subir el .env real a GitHub)
```

## Seguridad, cosas a tener en cuenta

- El `.env` con vuestras contraseñas reales **nunca debe subirse a GitHub**.
  Si haces `git init` en esta carpeta, crea un archivo `.gitignore` con la linea `.env` dentro
- La `MASTER_ADMIN_PASSWORD` es vuestra llave maestra, no la compartais
- Las contraseñas generadas para quien pide acceso se guardan cifradas (hash), no en texto plano
