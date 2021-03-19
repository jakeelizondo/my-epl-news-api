const knex = require('knex');
const { DATABASE_URL, NEWS_API_KEY } = require('./config');
const pg = require('pg');
const { TEAMS } = require('./TEAMS');
const fetch = require('node-fetch');

pg.defaults.ssl = process.env.NODE_ENV === 'production';

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

let teamsLength = TEAMS.length;
let now = new Date();
now.setHours(now.getHours() - 6);
let fromTime = now.toISOString();

for (let i = 0; i < teamsLength; i++) {
  let teamname = TEAMS[i].teamname;
  let teamcode = TEAMS[i].teamcode;
  let newsAPIQuery = `https://newsapi.org/v2/everything?qInTitle="${teamname}"-"cricket"-"Clinton"-"Oil"&sortBy=publishedAt&language=en&from=${fromTime}&apiKey=${NEWS_API_KEY}`;

  fetch(newsAPIQuery).then((res) => {
    if (!res.ok) {
      res.json().then((err) => console.log(err));
    }
    res.json().then((data) => {
      if (data.articles.length > 0) {
        let dbArticles = data.articles.map((article) => {
          return {
            team: teamcode,
            source: article.source.name,
            author: article.author,
            title: article.title,
            description: article.description,
            article_url: article.url,
            image_url: article.urlToImage,
            published_at: article.publishedAt,
            content: article.content,
          };
        });
        for (let i = 0; i < dbArticles.length; i++) {
          let currArticle = dbArticles[i];
          db.insert(currArticle)
            .into('articles')
            .then((data) => console.log('inserted', data.rowCount));
        }
      }
    });
  });
}
