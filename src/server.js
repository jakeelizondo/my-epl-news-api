const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');
const pg = require('pg');
const cors = require('cors');

pg.defaults.ssl = process.env.NODE_ENV === 'production';

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.use(cors());

app.set('db', db);

app.listen(PORT, () => {});
