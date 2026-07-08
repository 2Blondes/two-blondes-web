const mongoose = require('mongoose');
const crypto = require('crypto');

const AccessRequestSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  motivo: { type: String, default: '' },
  email: { type: String, required: true, lowercase: true, trim: true },
  token: { type: String, default: () => crypto.randomBytes(24).toString('hex') },
  status: {
    type: String,
    enum: ['pending_verification', 'pending', 'approved', 'rejected'],
    default: 'pending_verification'
  },
  passwordHash: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date, default: null },
  resolvedAt: { type: Date, default: null }
});

module.exports = mongoose.model('AccessRequest', AccessRequestSchema);