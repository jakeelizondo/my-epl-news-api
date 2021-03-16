const express = require('express');
const ArticlesService = require('./articles-service');
const { TEAMCODES } = require('../TEAMS');

const articlesRouter = express.Router();

// The standard way of doing HTTP routes is
// /:resource_type
// /:resource_type/:id
// and etc. For this route, I think it makes more sense to make it
// articlesRouter.route('/:teamCode/articles')
// and make the below /all route just /
articlesRouter.route('/').get((req, res, next) => {
  const page = req.query.page || 1;
  ArticlesService.getTeamArticles(req.app.get('db'), 'EVE', page)
    .then((articles) => {
      return res.status(200).json(ArticlesService.serializeArticles(articles));
    })
    .catch(next);
});

articlesRouter.route('/all').get((req, res, next) => {
  ArticlesService.getAllArticles(req.app.get('db'))
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
