const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUsername(db, username) {
    return db('users').where({ username }).first();
  },

  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  // use jwt library to generate jwt for a provided user

  makeJwt(user) {
    return jwt.sign(
      { user_id: user.id, team: user.team },
      process.env.JWT_SECRET,
      {
        subject: user.name,
        algorithm: 'HS256',
      }
    );
  },

  // use jwt library to verify jwt came from server

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, { algorithms: 'HS256' });
  },
};

module.exports = AuthService;
