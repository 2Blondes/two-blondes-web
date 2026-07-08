const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  data: { type: mongoose.Schema.Types.Mixed, default: () => defaultData() },
  updatedAt: { type: Date, default: Date.now }
}, { minimize: false });

function defaultData() {
  return {
    nav: { modelos: 'Modelos', historia: 'La marca', social: 'Siguenos' },
    hero: {
      subtitle: 'Dos modelos. Un solo criterio: hacerlo bien antes de hacerlo mas. Esta es la vitrina de lo que estamos construyendo.',
      background: ''
    },
    modelos: {
      eyebrow: 'La coleccion, de momento',
      heading: 'Dos camisetas. Cero relleno.',
      intro: 'Empezamos con dos modelos de camiseta de manga corta para hombre. Nada de catalogos infinitos: primero afinamos estas dos, luego ampliamos.',
      background: ''
    },
    models: [
      { id: 'm1', name: 'Nombre por definir', desc: 'Descripcion del corte, tejido y detalles de este modelo.', images: [], price: 0, stock: { S: 5, M: 5, L: 5 } },
      { id: 'm2', name: 'Nombre por definir', desc: 'Descripcion del corte, tejido y detalles de este modelo.', images: [], price: 0, stock: { S: 5, M: 5, L: 5 } }
    ],
    manifesto: {
      eyebrow: 'La marca',
      text: 'Dos personas, dos ideas claras, una camiseta a la vez.',
      background: ''
    },
    social: {
      eyebrow: 'Siguenos',
      heading: 'No vendemos aqui',
      intro: 'Todo el proceso y los lanzamientos van primero a redes.',
      instagram: '@twoblondes',
      tiktok: '@twoblondes',
      background: ''
    },
    footer: { text: 'Two Blondes (c) 2026' },
    spacers: { afterMarquee: 0, afterModelos: 0, afterHistoria: 0, afterSocial: 0 },
    popup: {
      eyebrow: 'Bienvenida',
      heading: '10% en tu primer pedido',
      desc: 'Suscribete y te lo enviamos ahora mismo por email.',
      code: 'TWOBLONDES10'
    },
    newsletter: {
      eyebrow: 'Acceso prioritario',
      heading: 'Entra antes al proximo drop'
    }
  };
}

ContentSchema.statics.getDefaultData = defaultData;

module.exports = mongoose.model('Content', ContentSchema);
