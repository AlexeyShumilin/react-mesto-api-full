const NotFoundError = require('../errors/not-found-err');

const pageNotFound = () => {
  throw new NotFoundError('The requested resource is not found');
};

module.exports = pageNotFound;
