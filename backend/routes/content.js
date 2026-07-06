const express = require('express');
const Content = require('../models/Content');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne({ singleton: 'main' });
    if (!content) {
      content = await Content.create({ singleton: 'main' });
    }
    res.json(content.data);
  } catch (err) {
    console.error('Error en GET /api/content:', err);
    res.status(500).json({ error: 'No se pudo cargar el contenido' });
  }
});

router.put('/', requireAdmin, async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Formato de contenido invalido' });
    }
    const content = await Content.findOneAndUpdate(
      { singleton: 'main' },
      { data: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(content.data);
  } catch (err) {
    console.error('Error en PUT /api/content:', err);
    res.status(500).json({ error: 'No se pudo guardar el contenido' });
  }
});

module.exports = router;