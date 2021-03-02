const express = require('express');
const ArticlesService = require('./articles-service');
const { TEAMCODES } = require('../TEAMS');

const articlesRouter = express.Router();

articlesRouter.route('/').get((req, res, next) => {
  const page = req.query.page || 1;
  ArticlesService.getTeamArticles(req.app.get('db'), 'EVE', page)
    .then((articles) => {
      return res.status(200).json(ArticlesService.serializeArticles(articles));
    })
    .catch(next);
});

articlesRouter.route('/:teamCode').get((req, res, next) => {
  const page = req.query.page || 1;
  // validate team

  if (!TEAMCODES.includes(req.params.teamCode)) {
    return res
      .status(400)
      .json({ error: { message: 'Provided team not recognized by server' } });
  }

  ArticlesService.getTeamArticles(req.app.get('db'), req.params.teamCode, page)
    .then((articles) => {
      return res.status(200).json(ArticlesService.serializeArticles(articles));
    })
    .catch(next);
});

module.exports = articlesRouter;
