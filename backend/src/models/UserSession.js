const mongoose = require('mongoose');
const { v4: uuidv4 } = require('crypto'); // crypto.randomUUID in Node v14.17+ or standard crypto module

/**
 * UserSession Schema Definition
 * Stores active user sessions for session tracking, remote logout, and refresh token validation.
 */
const userSessionSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => require('crypto').randomUUID(),
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refresh_token_hash: {
      type: String,
      required: true,
    },
    ip_address: {
      type: String,
      default: 'Unknown',
    },
    user_agent: {
      type: String,
      default: 'Unknown',
    },
    is_valid: {
      type: Boolean,
      default: true,
      index: true,
    },
    expires_at: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('UserSession', userSessionSchema);
