module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://postgres@localhost/my-epl-news',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'postgresql://postgres@localhost/my-epl-news-test',
  JWT_SECRET: process.env.JWT_SECRET,
  TEAMS: [
    'ARS',
    'AVL',
    'BRI',
    'BUR',
    'CHE',
    'CRY',
    'EVE',
    'FUL',
    'LEE',
    'LEI',
    'LIV',
    'MCI',
    'MUN',
    'NEW',
    'SOU',
    'SHU',
    'TOT',
    'WBA',
    'WHU',
    'WOL',
  ],
};
