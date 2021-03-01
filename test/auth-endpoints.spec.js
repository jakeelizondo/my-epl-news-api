const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe('Auth Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeTestFixtures();
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

  describe('POST /api/auth/login', () => {
    beforeEach('insert users into db', () => {
      return helpers.seedTestUsers(db, testUsers);
    });

    const requiredFields = ['username', 'password'];

    requiredFields.forEach((field) => {
      const loginBody = {
        username: testUser.username,
        password: testUser.password,
      };
      it(`responds with 404 error when ${field} is missing`, () => {
        delete loginBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginBody)
          .expect(400, {
            error: { message: `Missing ${field} in request body` },
          });
      });
    });

    it('responds with 400 and "invalid username or password" when login body contains fields, but user_name is not found in db', () => {
      const invalidUser = {
        username: 'bad username',
        password: testUser.password,
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUser)
        .expect(400, { error: { message: 'Incorrect username or password' } });
    });

    it('responds with 400 and "invalid username or password" when username exists, but password is wrong', () => {
      const invalidUserPass = {
        username: testUser.username,
        password: 'im a hacker',
      };

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUserPass)
        .expect(400, { error: { message: 'Incorrect username or password' } });
    });

    it('responds with 200 and a JWT token when the credentials are valid in the database', () => {
      const validUser = {
        username: testUser.username,
        password: testUser.password,
      };

      // make a JWT token with the valid user to compare against

      const expectedToken = AuthService.makeJwt(validUser);

      return supertest(app)
        .post('/api/auth/login')
        .send(validUser)
        .expect(200, { token: expectedToken });
    });
  });
});
