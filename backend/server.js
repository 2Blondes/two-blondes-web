require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');
const fs = require('fs');

const CART_FILE = path.join(__dirname, 'tb_cart.json');
const NOTES_FILE = path.join(__dirname, 'tb_notes.json');

function readJson(filePath, fallback) {
  try { if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (e) {}
  return fallback;
}
function writeJson(filePath, data) {
  try { fs.writeFileSync(filePath, JSON.stringify(data,null,2), 'utf8'); return true; } catch (e) { return false; }
}

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' })); // suficiente para varias fotos comprimidas en base64
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

// Lightweight sync endpoints (file-backed). They work even if Mongo isn't available.
app.get('/api/cart', (req, res) => {
  const cart = readJson(CART_FILE, []);
  res.json({ ok: true, cart });
});

app.post('/api/cart', (req, res) => {
  const payload = req.body && req.body.cart ? req.body.cart : [];
  const ok = writeJson(CART_FILE, payload);
  res.json({ ok: ok });
});

app.get('/api/notes', (req, res) => {
  const notes = readJson(NOTES_FILE, {});
  res.json({ ok: true, notes });
});

app.post('/api/notes', (req, res) => {
  const payload = req.body && req.body.notes ? req.body.notes : {};
  const ok = writeJson(NOTES_FILE, payload);
  res.json({ ok: ok });
});

// Cualquier otra ruta devuelve la web (para que funcione como single page)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

// Start the server regardless of Mongo availability. Try to connect but don't exit on failure.
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log('Conectado a MongoDB'); })
    .catch((err) => { console.error('Error conectando a MongoDB:', err); });
} else {
  console.log('MONGODB_URI no configurada — arrancando sin Mongo (endpoints file-backed activos)');
}
