const xss = require('xss');
const { attachPaginate } = require('knex-paginate');
attachPaginate();

const ArticlesService = {
  // Great for extracting out this sort of logic into the service.
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

  // Great
  serializeArticles(articles) {
    return articles.map(this.serializeArticle);
  },

  // This is personal preference, but query commands don't really need to be
  // extracted out, but just put into the router itself, unless it involves
  // very complex queries. This is simple enough to leave it in the router IMO
  // Extracting out logic into a service can be abused at times, leading
  // to having to open many files just to figure out what a simple query is doing.
  async getTeamArticles(db, team, page) {
    try {
      const result = await db
        .select('*')
        .from('articles')
        .where({ team })
        .orderBy('published_at', 'desc')
        .paginate({
          perPage: 10,
          currentPage: page,
        });

      return result.data;
    } catch (err) {
      // I see what you're doing with catch statements, but there are cases
      // where you simply want a db query to blow up. Those errors can be
      // caught in exception monitoring tools and resolved. If you console.log
      // it out like this, it becomes a silent error, making it easy to overlook
      // that you have a bug in your system.
      console.log(err);
    }
  },
  async getAllArticles(db) {
    try {
      const result = await db
        .select('*')
        .from('articles')
        .orderBy('published_at', 'desc');
      return result;
    } catch (err) {
      // I see what you're doing with catch statements, but there are cases
      // where you simply want a db query to blow up. Those errors can be
      // caught in exception monitoring tools and resolved. If you console.log
      // it out like this, it becomes a silent error, making it easy to overlook
      // that you have a bug in your system.
      console.log(err);
    }
  },

  // Logic like this is simple enough to just leave in the router IMO.
  insertArticle(db, article) {
    return db.insert(article).into('articles');
  },
};

module.exports = ArticlesService;
