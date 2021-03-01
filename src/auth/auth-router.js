const express = require('express');
const AuthService = require('./auth-service');

const jsonBodyParser = express.json();

const authRouter = express.Router();

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  //check to make sure fields are provided

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing ${key} in request body` },
      });
    }
  }

  //if fields provided, try to get user from database
  AuthService.getUserWithUsername(req.app.get('db'), loginUser.username)
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: { message: 'Incorrect username or password' },
        });
      }

      //if user is valid, compare login password against db password
      return AuthService.comparePasswords(loginUser.password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              error: { message: 'Incorrect username or password' },
            });
          }

          //if all credentials valid, generate and return jwt to user to use at protected endpoints
          const token = AuthService.makeJwt(loginUser);
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = authRouter;
