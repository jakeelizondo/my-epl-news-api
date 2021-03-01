const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', function () {
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

  beforeEach('insert and fill tables', () => {
    return helpers.seedTestTables(db, testUsers, testArticles);
  });

  const protectedEndpoints = [
    {
      name: 'GET /api/user/articles',
      path: '/api/user/articles',
    },
  ];

  protectedEndpoints.forEach((endpoint) => {
    describe(endpoint.name, () => {
      it('responds with 401 "missing bearer token" when no JWT token provided', () => {
        return supertest(app)
          .get(endpoint.path)
          .expect(401, { error: { message: 'Missing bearer token' } });
      });

      it('responds 401 unauthorized when bearer token is provided but JWT secret is incorrect', () => {
        const invalidSecret = 'This is not a real JWT secret';
        return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(testUser, invalidSecret))
          .expect(401, { error: { message: 'Unauthorized request' } });
      });

      it('responds with 401 unauthorized when the JWT secret is correct but incorrect user in payload subject', () => {
        const invalidUserSub = {
          username: 'not a real username',
          id: 1,
        };

        return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUserSub))
          .expect(401, { error: { message: 'Unauthorized request' } });
      });
    });
  });
});
