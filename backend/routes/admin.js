const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AccessRequest = require('../models/AccessRequest');
const {
  sendVerificationEmail,
  sendAccessRequestEmail,
  sendApprovedEmail,
  sendRejectedEmail
} = require('../mailer');

const router = express.Router();

function generatePassword() {
  return crypto.randomBytes(6).toString('hex');
}

function setAdminCookie(res) {
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000
  });
}

router.post('/request', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const name = (req.body.name || '').trim().slice(0, 100);
    const motivo = (req.body.motivo || '').trim().slice(0, 300);

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalido' });
    }

    const request = await AccessRequest.create({ email, name, motivo });
    await sendVerificationEmail(request);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en /request:', err);
    res.status(500).json({ error: 'No se pudo procesar la solicitud' });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const request = await AccessRequest.findOne({ token: req.params.token });
    if (!request) return res.status(404).send('Solicitud no encontrada.');
    if (request.status !== 'pending_verification') {
      return res.send('Este email ya estaba confirmado.');
    }

    request.status = 'pending';
    request.verifiedAt = new Date();
    await request.save();

    await sendAccessRequestEmail(request);
    res.send('Email confirmado. Tu solicitud ha sido enviada a Two Blondes, te avisaremos si se aprueba.');
  } catch (err) {
    console.error('Error en /verify:', err);
    res.status(500).send('Error al confirmar el email.');
  }
});

router.get('/approve/:token', async (req, res) => {
  try {
    const request = await AccessRequest.findOne({ token: req.params.token });
    if (!request) return res.status(404).send('Solicitud no encontrada.');
    if (request.status === 'pending_verification') {
      return res.send('Esta persona todavia no ha confirmado su email.');
    }
    if (request.status !== 'pending') return res.send('Esta solicitud ya se resolvio antes.');

    const plainPassword = generatePassword();
    request.passwordHash = await bcrypt.hash(plainPassword, 10);
    request.status = 'approved';
    request.resolvedAt = new Date();
    await request.save();

    await sendApprovedEmail(request.email, plainPassword);
    res.send(`Acceso aprobado para ${request.email}. Se le ha enviado la contraseña por email.`);
  } catch (err) {
    console.error('Error en /approve:', err);
    res.status(500).send('Error al aprobar la solicitud.');
  }
});

router.get('/reject/:token', async (req, res) => {
  try {
    const request = await AccessRequest.findOne({ token: req.params.token });
    if (!request) return res.status(404).send('Solicitud no encontrada.');
    if (request.status !== 'pending') return res.send('Esta solicitud ya se resolvio antes.');

    request.status = 'rejected';
    request.resolvedAt = new Date();
    await request.save();

    await sendRejectedEmail(request.email);
    res.send(`Solicitud de ${request.email} rechazada.`);
  } catch (err) {
    console.error('Error en /reject:', err);
    res.status(500).send('Error al rechazar la solicitud.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Falta la contraseña' });

    if (password === process.env.MASTER_ADMIN_PASSWORD) {
      setAdminCookie(res);
      return res.json({ ok: true });
    }

    const approvedRequests = await AccessRequest.find({ status: 'approved' });
    for (const reqDoc of approvedRequests) {
      if (reqDoc.passwordHash && await bcrypt.compare(password, reqDoc.passwordHash)) {
        setAdminCookie(res);
        return res.json({ ok: true });
      }
    }

    res.status(401).json({ error: 'Contraseña incorrecta' });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ error: 'Error al iniciar sesion' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) return res.json({ isAdmin: false });
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAdmin: true });
  } catch (err) {
    res.json({ isAdmin: false });
  }
});

module.exports = router;