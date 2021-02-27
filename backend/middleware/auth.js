const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized-err');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedErr('Authorization required ');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedErr('Authorization required ');
  }

  req.user = payload;
  next();

  return true;
};

module.exports = { auth };
