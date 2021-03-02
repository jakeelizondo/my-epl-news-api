const xss = require('xss');
const { attachPaginate } = require('knex-paginate');
attachPaginate();

const ArticlesService = {
  serializeArticle(article) {
    return {
      id: article.id,
      team: article.team,
      source: xss(article.source),
      author: xss(article.author),
      title: xss(article.title),
      description: xss(article.description),
      article_url: xss(article.article_url),
      image_url: xss(article.image_url),
      published_at: article.published_at,
      content: xss(article.content),
    };
  },

  serializeArticles(articles) {
    return articles.map(this.serializeArticle);
  },

  async getTeamArticles(db, team, page) {
    try {
      const result = await db
        .select('*')
        .from('articles')
        .where({ team })
        .paginate({
          perPage: 10,
          currentPage: page,
        });

      return result.data;
    } catch (err) {
      console.log(err);
    }
  },

  insertArticle(db, article) {
    return db.insert(article).into('articles');
  },
};

module.exports = ArticlesService;
