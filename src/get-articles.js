const knex = require('knex');
const { DATABASE_URL, NEWS_API_KEY } = require('./config');
const pg = require('pg');
const { TEAMS } = require('./TEAMS');
const fetch = require('node-fetch');
const ArticlesService = require('./articles/articles-service');

pg.defaults.ssl = process.env.NODE_ENV === 'production';

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

const LeedsQuery = {
  status: 'ok',
  teamcode: 'LEE',
  teamname: 'Leeds United',
  totalResults: 68,
  articles: [
    {
      source: {
        id: null,
        name: 'SB Nation',
      },
      author: 'Holtecast',
      title:
        'HOLTECAST #284 | Leeds United 0-1 Aston Villa - No Grealish, No Problem',
      description:
        'Cole Pettem is joined by Danny Raza and Simon O’Regan to go over a prideful win against Leeds United and look ahead to the trip to Bramall Lane on Wednesday against Sheffield United....You can listen for FREE on Acast, Apple Podcasts, and Spotify - Enjoy!',
      url:
        'https://7500toholte.sbnation.com/aston-villa-podcast-holtecast/2021/3/1/22306351/holtecast-284-leeds-united-0-1-aston-villa',
      urlToImage:
        'https://cdn.vox-cdn.com/thumbor/OKGB-2J0yRwrMihnlzUu1w6-lIs=/0x20:1024x556/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22335392/Holtecast_Podcast___Template___7500_Website.jpg',
      publishedAt: '2021-03-01T18:35:00Z',
      content:
        'Cole Pettem is joined by Danny Raza and Simon O’Regan to go over a prideful win against Leeds United and look ahead to the trip to Bramall Lane on Wednesday against Sheffield United....You can listen… [+1334 chars]',
    },
    {
      source: {
        id: null,
        name: 'SB Nation',
      },
      author: 'Sebastianbacon8',
      title: 'Player Ratings: Leeds United 0-1 Aston Villa',
      description:
        'In the absence of captain, Jack Grealish, Dean Smith’s men were able grind out a much needed victory in what was a feisty affair at Elland Road. Here’s how Seb rated the lads...',
      url:
        'https://7500toholte.sbnation.com/aston-villa-player-ratings-avfc/2021/2/28/22304955/player-ratings-leeds-0-1-aston-villa',
      urlToImage:
        'https://cdn.vox-cdn.com/thumbor/Vez3vjG7kaASB8xzf05148DES8U=/0x272:3794x2258/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22333622/1304396705.jpg',
      publishedAt: '2021-02-28T09:00:00Z',
      content:
        'Photo by Laurence Griffiths/Getty Images\r\n\n \n\n In the absence of captain, Jack Grealish, Dean Smith’s men were able grind out a much needed victory in what was a feisty affair at Elland Road. Here’s … [+4270 chars]',
    },
  ],
};

const EvertonQuery = {
  status: 'ok',
  teamcode: 'EVE',
  teamname: 'Everton',
  totalResults: 851,
  articles: [
    {
      source: {
        id: null,
        name: 'Mirror Online',
      },
      author: 'mirrornews@mirror.co.uk (Andy Dunn)',
      title:
        "St John's memorable 1965 goal made him Liverpool legend and ended Everton taunts",
      description:
        'What shall we do if the Lord comes? Move St John to inside-right. Ian St John, who passed away aged 82 on Tuesday, was Liverpool footballing deity',
      url:
        'https://www.mirror.co.uk/sport/football/news/ian-st-johns-memorable-1965-23593665',
      urlToImage:
        'https://i2-prod.mirror.co.uk/incoming/article23589967.ece/ALTERNATES/s1200/0_PA-758679.jpg',
      publishedAt: '2021-03-02T17:00:00Z',
      content:
        'On a Liverpool church billboard in the 1960s, a poster asked passers-by: What will you do if the Lord comes?\r\nBeneath the question, someone had written: Move St John to inside-right.\r\nOn Merseyside, … [+3506 chars]',
    },
    {
      source: {
        id: null,
        name: 'SB Nation',
      },
      author: 'Matthew Chandler',
      title: 'ANALYSIS: Are Everton better without the ball than with it?',
      description:
        'Monday’s win over Southampton was another earned with a smaller share of possession. The Blues’ best bet appears to be trusting their instincts and not over-thinking their next move',
      url:
        'https://royalbluemersey.sbnation.com/2021/3/2/22308854/everton-better-without-the-ball-than-with-it-southampton-recap-stats-analysis-premier-league',
      urlToImage:
        'https://cdn.vox-cdn.com/thumbor/ct_t3qiAeOqI-BPQUe_Gus-jnuY=/0x0:4318x2261/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22339253/1304774990.jpg',
      publishedAt: '2021-03-02T16:03:07Z',
      content:
        'If Evertons New Years Day home defeat to West Ham United felt emblematic of their recent Goodison Park form, Carlo Ancelottis comments after the 1-0 loss similarly epitomised one of his sides greates… [+14778 chars]',
    },
  ],
};

const testsQuerys = [
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  EvertonQuery,
  LeedsQuery,
];

console.log('getting articles');

let teamsLength = TEAMS.length;
let now = new Date();
now.setHours(now.getHours() - 6);
let fromTime = now.toISOString();

for (let i = 0; i < teamsLength; i++) {
  let teamname = TEAMS[i].teamname;
  let teamcode = TEAMS[i].teamcode;
  let newsAPIQuery = `https://newsapi.org/v2/everything?qInTitle=${teamname}&sortBy=publishedAt&language=en&from=${fromTime}&apiKey=${NEWS_API_KEY}`;

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

db.destroy();

// let dbArticles;
// let dbPromiseArray = [];
// for (let i = 0; i < testsQuerys.length; i++) {
//   let teamname = testsQuerys[i].teamname;
//   let teamcode = testsQuerys[i].teamcode;

//   dbArticles = testsQuerys[i].articles.map((article) => {
//     return {
//       team: teamcode,
//       source: article.source.name,
//       author: article.author,
//       title: article.title,
//       description: article.description,
//       article_url: article.url,
//       image_url: article.urlToImage,
//       published_at: article.publishedAt,
//       content: article.content,
//     };
//   });
//   console.log(dbArticles);

//   for (let i = 0; i < dbArticles.length; i++) {
//     let currArticle = dbArticles[i];
//     dbPromiseArray.push(ArticlesService.insertArticle(db, currArticle));
//   }
// }

// console.log(dbPromiseArray);
// Promise.all(dbPromiseArray);
