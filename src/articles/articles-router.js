const express = require('express');
const ArticlesService = require('./articles-service');
const { TEAMCODES } = require('../TEAMS');

const articlesRouter = express.Router();

articlesRouter.route('/:teamCode').get((req, res, next) => {
  // validate team

  if (!TEAMCODES.includes(req.params.teamCode)) {
    return res
      .status(400)
      .json({ error: { message: 'Provided team not recognized by server' } });
  }

  ArticlesService.getTeamArticles(req.app.get('db'), req.params.teamCode).then(
    (articles) => {
      return res.status(200).json(ArticlesService.serializeArticles(articles));
    }
  );
});

module.exports = articlesRouter;
