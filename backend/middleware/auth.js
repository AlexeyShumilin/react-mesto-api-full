const jwt = require('jsonwebtoken');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(422).send({ error: 'user already exist' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res.status(422).send({ error: 'user already exist' });
  }

  req.user = payload;
  next();

  return true;
};

module.exports = { auth };
