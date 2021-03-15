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
    const { article_id } = req.body;
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        error: { message: 'Missing user_id' },
      });
    }
    if (!article_id) {
      return res.status(400).json({
        error: { message: 'Missing article_id' },
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
    const { article_id } = req.body;
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        error: { message: 'Missing user_id' },
      });
    }
    if (!article_id) {
      return res.status(400).json({
        error: { message: 'Missing article_id' },
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

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
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
  })
  .patch(requireAuth, jsonBodyParser, async function (req, res, next) {
    let user_id = req.user.id;
    let { username, password, team } = req.body;

    if (!username && !password && !team) {
      return res
        .status(400)
        .json({ error: { message: 'Must include values to update' } });
    }

    //if password update, hash password before going into db
    if (password) {
      const passwordError = UsersService.validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ error: { message: passwordError } });
      }
      password = await UsersService.hashPassword(password);
    }

    const updateUser = { username, password, team };

    // sanitize update user for empty fields
    for (let key in updateUser) {
      if (!updateUser[key]) {
        delete updateUser[key];
      }
    }

    const numRowsAffected = await UsersService.updateUser(
      req.app.get('db'),
      user_id,
      updateUser
    );

    if (!numRowsAffected) {
      return res.status(400).json({ error: { message: 'No fields updated' } });
    } else {
      return res.status(204).json();
    }
  })
  .delete(requireAuth, (req, res, next) => {
    let user_id = req.user.id;

    UsersService.deleteUser(req.app.get('db'), user_id).then(
      (numRowsAffected) => {
        if (!numRowsAffected) {
          return res
            .status(400)
            .json({ error: { message: 'User not recognized' } });
        } else {
          return res.status(204).json();
        }
      }
    );
  });

module.exports = usersRouter;
