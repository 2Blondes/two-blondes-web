require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const PALABRA_MAGICA = process.env.MAGIC_WORD;

app.post('/access-request', async (req, res) => {
  const { email, name, magicWord } = req.body || {};

  if (!email || !magicWord) {
    return res.status(400).json({ ok: false, error: 'Faltan datos' });
  }

  if (magicWord !== PALABRA_MAGICA) {
    return res.status(401).json({ ok: false, error: 'Palabra mágica incorrecta' });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'twoblondesstudio@gmail.com',
      subject: 'Solicitud de acceso admin',
      text: `Nombre: ${name || '-'}\nEmail: ${email}\nPalabra mágica correcta.\nRevisar y aprobar manualmente.`
    });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));