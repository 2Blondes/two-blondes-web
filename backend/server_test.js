const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/api/content', (req, res) => {
  res.json({
    hero: { subtitle: 'Limited drops. Bold cuts.' },
    modelos: { eyebrow: '', heading: 'Modelos', intro: '' },
    manifesto: { eyebrow: '', text: 'Two Blondes - minimal streetwear' },
    social: { instagram: '@twoblondes', tiktok: '@twoblondes' },
    offer: { text: 'Envio gratis a partir de 60 EUR', threshold: 60 },
    popup: { code: 'TWOBLONDES10', eyebrow: 'Bienvenida', heading: '10% en tu primer pedido', desc: 'Suscribete y te lo enviamos ahora mismo por email.' },
    newsletter: { eyebrow: 'Acceso prioritario', heading: 'Entra antes al proximo drop' },
    models: [
      { id: 'alba', name: 'Modelo Alba', desc: 'Camiseta Alba', price: 45, images: [], stock: { S: 3, M: 2, L: 0 }, rating: 4.8, reviewCount: 12 },
      { id: 'blonde', name: 'Modelo Blonde', desc: 'Camiseta Blonde', price: 55, images: [], stock: { S: 1, M: 0, L: 2 }, rating: 4.6, reviewCount: 9 }
    ]
  });
});

// Simple persistence for cart and notes (file-backed)
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

app.listen(PORT, () => console.log('Test server running on http://localhost:' + PORT));
