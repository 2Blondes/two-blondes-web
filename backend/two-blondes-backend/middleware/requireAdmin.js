const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  try {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'No autenticado' });
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Sesion invalida o caducada' });
  }
}

module.exports = requireAdmin;
