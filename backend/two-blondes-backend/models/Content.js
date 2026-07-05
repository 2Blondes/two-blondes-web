const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  heroSub: {
    type: String,
    default: 'Dos modelos. Un solo criterio: hacerlo bien antes de hacerlo mas. Esta es la vitrina de lo que estamos construyendo.'
  },
  headingModelos: { type: String, default: 'Dos camisetas. Cero relleno.' },
  introModelos: {
    type: String,
    default: 'Empezamos con dos modelos de camiseta de manga corta para hombre. Nada de catalogos infinitos: primero afinamos estas dos, luego ampliamos.'
  },
  model1Name: { type: String, default: 'Nombre por definir' },
  model1Desc: { type: String, default: 'Descripcion del corte, tejido y detalles de este modelo.' },
  model1Img: { type: String, default: '' },
  model2Name: { type: String, default: 'Nombre por definir' },
  model2Desc: { type: String, default: 'Descripcion del corte, tejido y detalles de este modelo.' },
  model2Img: { type: String, default: '' },
  manifestoText: {
    type: String,
    default: 'Dos personas, <span class="accent">dos ideas claras</span>, una camiseta a la vez.'
  },
  instaHandle: { type: String, default: '@twoblondes' },
  tiktokHandle: { type: String, default: '@twoblondes' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
