const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { TEAMCODES } = require('../TEAMS');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/articles')
  .all(requireAuth)
  .get((req, res, next) => {
    if (!req.user.team) {
      return res
        .status(400)
        .json({ error: { message: 'No team attached to user' } });
    }

    UsersService.getUserArticles(req.app.get('db'), req.user.id)
      .then((articles) => {
        return res.status(200).json(articles);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { user_id, article_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: { message: 'Missing user_id in request body' },
      });
    }
    if (!article_id) {
      return res.status(400).json({
        error: { message: 'Missing article_id in request body' },
      });
    }

    let newRecord = { user_id, article_id };

    UsersService.addUserArticle(req.app.get('db'), newRecord)
      .then(() => {
        return res.status(201).json();
      })
      .catch(next);
  })
  .delete(jsonBodyParser, (req, res, next) => {
    const { user_id, article_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: { message: 'Missing user_id in request body' },
      });
    }
    if (!article_id) {
      return res.status(400).json({
        error: { message: 'Missing article_id in request body' },
      });
    }

    let deleteRecord = { user_id, article_id };

    UsersService.deleteUserArticle(req.app.get('db'), deleteRecord)
      .then((numRowsAffected) => {
        if (numRowsAffected) {
          return res.status(204).json();
        } else {
          next();
        }
      })
      .catch(next);
  });

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

  if (!TEAMCODES.includes(team)) {
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
