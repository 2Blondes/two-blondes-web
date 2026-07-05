const mongoose = require('mongoose');
const crypto = require('crypto');

const AccessRequestSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  token: { type: String, default: () => crypto.randomBytes(24).toString('hex') },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  passwordHash: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

module.exports = mongoose.model('AccessRequest', AccessRequestSchema);
