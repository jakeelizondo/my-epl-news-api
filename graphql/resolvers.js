const fetch = require('node-fetch');

const resolver = {
  Query: {
    articles: () => {
      return fetch(
        'https://my-epl-news.herokuapp.com/api/articles'
      ).then((res) => res.json());
    },
  },
};

module.exports = resolver;
