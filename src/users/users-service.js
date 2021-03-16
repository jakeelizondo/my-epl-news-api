const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
  // I think validate password functions belong to the auth service since it deals
  // with authentication. But good for encapsulating the logic.
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }

    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }

    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with a space';
    }

    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
  },

  hasUserWithUsername(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then((user) => {
        return !!user;
      });
  },

  getUserById(db, id) {
    return db('users').where({ id }).first();
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },

  serializeUser(user) {
    return {
      id: user.id,
      name: xss(user.name),
      team: xss(user.team),
      username: xss(user.username),
    };
  },
  async hashPassword(password) {
    const pass = await bcrypt.hash(password, 12);
    return pass;
  },

  async updateUser(db, id, user) {
    try {
      const numRowsAffected = await db('users')
        .where({
          id,
        })
        .update(user);

      return numRowsAffected;
    } catch (err) {
      console.error(err);
    }
  },

  async deleteUser(db, id) {
    try {
      const numRowsAffected = await db('users')
        .where({
          id,
        })
        .del();

      return numRowsAffected;
    } catch (err) {
      console.error(err);
    }
  },

  getUserArticles(db, id) {
    return db
      .select(
        'articles.id',
        'articles.team',
        'articles.source',
        'articles.author',
        'articles.title',
        'articles.description',
        'articles.article_url',
        'articles.image_url',
        'articles.published_at',
        'articles.content'
      )
      .from('articles')
      .join('users_articles', { 'articles.id': 'users_articles.article_id' })
      .join('users', { 'users.id': 'users_articles.user_id' })
      .where({ 'users_articles.user_id': id })
      .orderBy('published_at', 'desc');
  },

  // As with in the articles service, I generally don't like to extract out
  // query logic into a service if it's simple. It is easier to read this queryu
  // in the router itself rather than having to open another file to understand
  // what the query is doing.
  async addUserArticle(db, newRecord) {
    let response = await db
      .insert(newRecord)
      .into('users_articles')
      .returning('*');

    return response;
  },

  // As with in the articles service, I generally don't like to extract out
  // query logic into a service if it's simple. It is easier to read this queryu
  // in the router itself rather than having to open another file to understand
  // what the query is doing.
  async deleteUserArticle(db, deleteRecord) {
    try {
      const numRowsAffected = await db('users_articles')
        .where({
          user_id: deleteRecord.user_id,
        })
        .andWhere({ article_id: deleteRecord.article_id })
        .del();

      return numRowsAffected;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = UsersService;
