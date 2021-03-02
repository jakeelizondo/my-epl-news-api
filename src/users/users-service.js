const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
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
      .where({ 'users_articles.user_id': id });
  },

  async addUserArticle(db, newRecord) {
    let response = await db
      .insert(newRecord)
      .into('users_articles')
      .returning('*');

    return response;
  },

  async deleteUserArticle(db, deleteRecord) {
    try {
      const numRowsAffected = await db('users_articles')
        .where({
          user_id: deleteRecord.user_id,
        })
        .andWhere({ article_id: deleteRecord.article_id })
        .del();
      console.log(numRowsAffected);
      return numRowsAffected;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = UsersService;
