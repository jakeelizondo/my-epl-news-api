const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeTestUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      password: 'password1',
      name: 'Test 1 first',
      team: 'EVE',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 2,
      username: 'test-user-2',
      password: 'password2',
      name: 'Test 2 first',
      team: 'LIV',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 3,
      username: 'test-user-3',
      password: 'password3',
      name: 'Test 3 first',
      team: 'TOT',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 4,
      username: 'test-user-4',
      password: 'password4',
      name: 'Test 4 first',
      team: 'ARS',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 5,
      username: 'test-user-5',
      password: 'password5',
      name: 'Test 5 first',
      team: 'WOL',
      date_created: '2023-01-18T16:28:32.615Z',
    },
  ];
}

function makeTestArticlesArray() {
  return [
    {
      id: 1,
      team: 'EVE',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 2,
      team: 'EVE',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 3,
      team: 'LEE',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 4,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 5,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 6,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 7,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 8,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 9,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 10,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 11,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 12,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 13,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 14,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 15,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
    {
      id: 16,
      team: 'WOL',
      source: 'test-source',
      author: 'test-author',
      title: 'test-title',
      description: 'test-description',
      article_url: 'https://test-url.com',
      image_url: 'https://test-image-url.com',
      published_at: '2021-03-01T05:00:00.000Z',
      content: 'test-article-content',
    },
  ];
}

function seedUsersArticles(db, usersArticles) {}

// clean tables of db
function cleanTables(db) {
  return db.raw(
    'TRUNCATE users, articles, users_articles RESTART IDENTITY CASCADE'
  );
}

function makeTestFixtures() {
  const testUsers = makeTestUsersArray();
  const testArticles = makeTestArticlesArray();

  return { testUsers, testArticles };
}

// function to seed test users into db with encrypted passwords
function seedTestUsers(db, users) {
  //map over each user, spread out the rest of the user object but replace password w/ bcrypt version
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  //insert prepped users into db, will then need to manually set sequence table to start after the id of the last user in table to prevent errors
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() => {
      return db.raw(
        `SELECT setval('users_id_seq', ?)`,
        users[users.length - 1].id
      );
    });
}

//seed all tables for tests

function seedTestTables(db, users, articles) {
  return seedTestUsers(db, users)
    .then(() => {
      return db.into('articles').insert(articles);
    })
    .then(() => {
      return db.raw(
        `SELECT setval('articles_id_seq', ?)`,
        articles[articles.length - 1].id
      );
    })
    .then(() => {
      return db.into('users_articles').insert({ user_id: 1, article_id: 2 });
    });
}

//make jwt authorization header

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });

  return `Bearer ${token}`;
}

module.exports = {
  makeTestUsersArray,
  makeAuthHeader,
  makeTestArticlesArray,
  seedTestUsers,
  seedTestTables,
  cleanTables,
  makeTestFixtures,
};
