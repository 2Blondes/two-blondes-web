const express = require('express');
const Content = require('../models/Content');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

const EDITABLE_FIELDS = [
  'heroSub', 'headingModelos', 'introModelos',
  'model1Name', 'model1Desc', 'model1Img',
  'model2Name', 'model2Desc', 'model2Img',
  'manifestoText', 'instaHandle', 'tiktokHandle'
];

router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne({ singleton: 'main' });
    if (!content) {
      content = await Content.create({ singleton: 'main' });
    }
    res.json(content);
  } catch (err) {
    console.error('Error en GET /api/content:', err);
    res.status(500).json({ error: 'No se pudo cargar el contenido' });
  }
});

router.put('/', requireAdmin, async (req, res) => {
  try {
    const update = { updatedAt: new Date() };
    EDITABLE_FIELDS.forEach((field) => {
      if (typeof req.body[field] === 'string') update[field] = req.body[field];
    });
    const content = await Content.findOneAndUpdate(
      { singleton: 'main' },
      update,
      { new: true, upsert: true }
    );
    res.json(content);
  } catch (err) {
    console.error('Error en PUT /api/content:', err);
    res.status(500).json({ error: 'No se pudo guardar el contenido' });
  }
});

module.exports = router;
