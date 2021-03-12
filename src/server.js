const app = require('./app');
const knex = require('knex');
const fetch = require('node-fetch');
const { PORT, DATABASE_URL } = require('./config');
const pg = require('pg');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

//construct schema for GraphQL

const typeDefs = gql`
  type Query {
    articles: [Articles]
    teamArticles(team: String): [Articles]
  }
  type Articles {
    id: ID!
    team: String
    source: String
    author: String
    title: String
    description: String
    article_url: String
    image_url: String
    published_at: String
    content: String
  }
`;

//resolvers for schema fields

const resolvers = {
  Query: {
    articles: () => {
      return fetch(
        'https://my-epl-news.herokuapp.com/api/articles/all'
      ).then((res) => res.json());
    },

    teamArticles: (_, { team }) => {
      return fetch(
        `https://my-epl-news.herokuapp.com/api/articles/${team}`
      ).then((res) => res.json());
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

pg.defaults.ssl = process.env.NODE_ENV === 'production';

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.use(cors());

app.set('db', db);

app.listen(PORT, () => {});
