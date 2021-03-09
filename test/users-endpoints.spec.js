const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../src/config');

describe('User Endpoints', function () {
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

  describe('POST /api/user', () => {
    context('User Validation', () => {
      beforeEach('insert and fill tables', () => {
        return helpers.seedTestTables(db, testUsers, testArticles);
      });
      const requiredFields = ['name', 'team', 'username', 'password'];

      requiredFields.forEach((field) => {
        const registerAttempt = {
          name: 'Popeye',
          team: 'EVE',
          username: 'popeye',
          password: 'popeyepassword',
        };

        it(`responds with a 400 error when ${field} is missing`, () => {
          delete registerAttempt[field];
          return supertest(app)
            .post('/api/user')
            .send(registerAttempt)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });

      it('responds with 400 "Password must be longer than 8 characters" when empty password', () => {
        const shortPassUser = {
          name: 'Popeye',
          team: 'EVE',
          username: 'popeye',
          password: 'pop',
        };

        return supertest(app)
          .post('/api/user')
          .send(shortPassUser)
          .expect(400, {
            error: { message: 'Password must be longer than 8 characters' },
          });
      });

      it('responds with 400 "Password must be shorter than 72 characters" when long password', () => {
        const longPassUser = {
          name: 'Popeye',
          team: 'EVE',
          username: 'popeye',
          password: '*'.repeat(73),
        };

        return supertest(app)
          .post('/api/user')
          .send(longPassUser)
          .expect(400, {
            error: { message: 'Password must be less than 72 characters' },
          });
      });
      it('responds with 400 "Password cannot begin with a space" when space at beginning of password', () => {
        const spaceBeforePassUser = {
          name: 'Popeye',
          team: 'EVE',
          username: 'popeye',
          password: ' popeyepassword',
        };

        return supertest(app)
          .post('/api/user')
          .send(spaceBeforePassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 "Password cannot end with a space" when space at end of password', () => {
        const spaceAfterPassUser = {
          name: 'Popeye',
          team: 'EVE',
          username: 'popeye',
          password: 'popeyepassword ',
        };

        return supertest(app)
          .post('/api/user')
          .send(spaceAfterPassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 error when password isnt complex enough,', () => {
        const badPassUser = {
          name: 'Popeye',
          team: 'EVE',
          username: 'popeye',
          password: '11AAaabb',
        };

        return supertest(app)
          .post('/api/user')
          .send(badPassUser)
          .expect(400, {
            error: {
              message:
                'Password must contain 1 upper case, lower case, number and special character',
            },
          });
      });
      it('responds with 400 error when username is already taken', () => {
        const takenPassUser = {
          name: 'Popeye',
          team: 'EVE',
          username: testUser.username,
          password: '11AAaa!!',
        };

        return supertest(app)
          .post('/api/user')
          .send(takenPassUser)
          .expect(400, {
            error: {
              message: 'Username already taken',
            },
          });
      });
    });

    it('responds with 400 error when team is invalid', () => {
      const takenPassUser = {
        name: 'Popeye',
        team: 'XXX',
        username: 'popeye',
        password: '11AAaa!!',
      };

      return supertest(app)
        .post('/api/user')
        .send(takenPassUser)
        .expect(400, {
          error: {
            message: 'Invalid team submission',
          },
        });
    });

    context('Successful submission', () => {
      it('responds with 201, serialized user, storing bcrypt password', () => {
        const newUser = {
          username: 'popeye',
          password: '11AAaa!!',
          name: 'Test last',
          team: 'EVE',
        };

        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect((response) => {
            expect(response.body).to.have.property('id');
            expect(response.body.username).to.eql(newUser.username);
            expect(response.body.name).to.eql(newUser.name);
            expect(response.body.team).to.eql(newUser.team);
            expect(response.body).to.not.have.property('password');
            expect(response.headers.location).to.eql(
              `/api/user/${response.body.id}`
            );
          })
          .expect((response) => {
            db.from('users')
              .select('*')
              .where({ id: response.body.id })
              .first()
              .then((row) => {
                expect(row.username).to.eql(newUser.username);
                expect(row.name).to.eql(newUser.name);
                expect(row.team).to.eql(newUser.team);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((isMatch) => {
                expect(isMatch).to.be.true;
              });
          });
      });
    });
  });

  describe('USER ARTICLES ENDPOINTS', () => {
    describe('GET /api/user/articles', () => {
      beforeEach('insert and fill tables', () => {
        return helpers.seedTestTables(db, testUsers, testArticles);
      });

      it('responds with 200 and the user saved articles', () => {
        let expectedResponse = [
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
          .get('/api/user/articles')
          .set('Authorization', helpers.makeAuthHeader(testUser, JWT_SECRET))
          .expect(200, expectedResponse);
      });
    });

    describe('POST /api/user/articles', () => {
      beforeEach('insert and fill tables', () => {
        return helpers.seedTestTables(db, testUsers, testArticles);
      });

      const requiredFields = ['article_id'];
      requiredFields.forEach((field) => {
        it(`responds with 400 and missing ${field} if ${field} is not included in the request`, () => {
          let request = {
            article_id: 1,
          };
          delete request[field];

          return supertest(app)
            .post('/api/user/articles')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(request)
            .expect(400, {
              error: { message: `Missing ${field}` },
            });
        });
      });

      it('responds with 201 and creates a record in the users_articles table', () => {
        let request = {
          user_id: testUser.id,
          article_id: 1,
        };
        let expectedResponse = [
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
          .post('/api/user/articles')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(request)
          .expect(201)
          .then(() => {
            return supertest(app)
              .get('/api/user/articles')
              .set(
                'Authorization',
                helpers.makeAuthHeader(testUser, JWT_SECRET)
              )
              .expect(200, expectedResponse);
          });
      });
    });

    describe('DELETE /api/user/articles', () => {
      beforeEach('insert and fill tables', () => {
        return helpers.seedTestTables(db, testUsers, testArticles);
      });

      const requiredFields = ['article_id'];
      requiredFields.forEach((field) => {
        it(`responds with 400 and missing ${field} if ${field} is not included in the request`, () => {
          let request = {
            article_id: 1,
          };
          delete request[field];

          return supertest(app)
            .delete('/api/user/articles')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(request)
            .expect(400, {
              error: { message: `Missing ${field}` },
            });
        });
      });

      it('responds with 204 and deletes record in the users_articles table', () => {
        let request = {
          user_id: testUser.id,
          article_id: 1,
        };
        let expectedResponse = [
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
          .post('/api/user/articles')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(request)
          .expect(201)
          .then(() => {
            return supertest(app)
              .delete('/api/user/articles')
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .send(request)
              .expect(204)
              .then(() => {
                return supertest(app)
                  .get('/api/user/articles')
                  .set(
                    'Authorization',
                    helpers.makeAuthHeader(testUser, JWT_SECRET)
                  )
                  .expect(200, expectedResponse);
              });
          });
      });
    });
  });
});
