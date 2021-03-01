const AuthService = require('../auth/auth-service');

async function requireAuth(req, res, next) {
  // get JWT token out of auth header

  const authToken = req.get('Authorization') || '';
  let bearerToken;

  //check to make sure token starts with bearer, if it does, slice down to just the jwt

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: { message: 'Missing bearer token' } });
  } else {
    bearerToken = authToken.slice('bearer '.length, authToken.length);
  }

  //token and user authentication

  try {
    // verify jwt

    const payload = AuthService.verifyJwt(bearerToken);

    // using payload, get user from database with username

    const user = await AuthService.getUserWithUsername(
      req.app.get('db'),
      payload.sub
    );

    if (!user) {
      return res
        .status(401)
        .json({ error: { message: 'Unauthorized request' } });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Unauthorized request' } });
  }
}

module.exports = { requireAuth };
