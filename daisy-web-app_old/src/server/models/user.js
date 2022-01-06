const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  AUTH_SALT_ROUNDS,
  AUTH_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRATION_IN_MINUTES,
  AUTH_EMAIL_TOKEN_EXPIRATION_IN_MINUTES,
} = require('../../../env.config');

const userDbSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  rank: {
    type: String,
    enum: [ 'user', 'admin' ],
    default: 'user',
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
}, {
  id: false,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
});

const User = mongoose.model('User', userDbSchema);

User.hashPassword = async (password) => {
  const passwordHash = await bcrypt.hash(`${password}`, AUTH_SALT_ROUNDS);
  return passwordHash;
};

User.comparePasswords = async (password, passwordHash) => {
  const result = await bcrypt.compare(`${password}`, passwordHash);
  return result;
};

User.createAccessToken = async ({ _id, email, rank }) => {
  const token = await jwt.sign(
    { _id, email, rank },
    AUTH_SECRET,
    { expiresIn: `${AUTH_ACCESS_TOKEN_EXPIRATION_IN_MINUTES}m` }
  );
  return token;
};

User.createRegistrationToken = async ({ email, password, nickname }) => {
  const token = await jwt.sign(
    { email, password, nickname },
    AUTH_SECRET,
    { expiresIn: `${AUTH_EMAIL_TOKEN_EXPIRATION_IN_MINUTES}m` }
  );
  return token;
};

User.createPasswordResetToken = async ({ email }) => {
  const token = await jwt.sign(
    { email },
    AUTH_SECRET,
    { expiresIn: `${AUTH_EMAIL_TOKEN_EXPIRATION_IN_MINUTES}m` }
  );
  return token;
};

module.exports = User;
