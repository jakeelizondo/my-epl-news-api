const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const { TEAMS } = require('../config');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route('/').post(jsonBodyParser, (req, res, next) => {
  const { password, username, name, team } = req.body;

  //validate required fields

  for (const field of ['name', 'team', 'username', 'password']) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: { message: `Missing '${field}' in request body` } });
    }
  }

  // validate team

  if (!TEAMS.includes(team)) {
    return res
      .status(400)
      .json({ error: { message: 'Invalid team submission' } });
  }

  //validate password

  const passwordError = UsersService.validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: { message: passwordError } });
  }

  //validate username not already in db
  UsersService.hasUserWithUsername(req.app.get('db'), username)
    .then((hasUserName) => {
      if (hasUserName) {
        return res.status(400).json({
          error: {
            message: 'Username already taken',
          },
        });
      }

      //if all pass, hash pass and insert user
      return UsersService.hashPassword(password).then((hashPass) => {
        const newUser = {
          password: hashPass,
          username,
          name,
          team,
        };
        return UsersService.insertUser(req.app.get('db'), newUser).then(
          (user) => {
            return res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
