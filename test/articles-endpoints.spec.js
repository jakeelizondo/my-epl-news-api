const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Articles Endpoints', function () {
  let db;

  const { testUsers, testArticles } = helpers.makeTestFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/articles/:teamCode?=page', () => {
    beforeEach('insert articles and fill tables', () => {
      return helpers.seedTestTables(db, testUsers, testArticles);
    });
    it('responds with 400 and error message if the team code is not in the list of codes on the server', () => {
      return supertest(app)
        .get('/api/articles/XXX')
        .expect(400, {
          error: { message: 'Provided team not recognized by server' },
        });
    });

    context('if there is only 1 page of articles', () => {
      it('responds with 200 and page 1 of articles for the provided team if no page provided', () => {
        const expectedArticles = [
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
        ];

        return supertest(app)
          .get('/api/articles/EVE')
          .expect(200, expectedArticles);
      });
      it('responds with 200 and all articles for the provided team', () => {
        const expectedArticles = [
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
        ];

        return supertest(app)
          .get('/api/articles/EVE?page=1')
          .expect(200, expectedArticles);
      });
    });

    context('if there is more than 1 page of articles', () => {
      it('responds with 200 and that page of articles', () => {
        const pageTwoArticles = [
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

        return supertest(app)
          .get('/api/articles/WOL?page=2')
          .expect(200, pageTwoArticles);
      });
    });
  });
});
