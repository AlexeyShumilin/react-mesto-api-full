const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;
const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedErr = require('../errors/conflict-err');

const getUser = (req, res, next) => {
  userModel.find({})
    .then((data) => res.status(200)
      .send(data))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  userModel.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User is not found');
      }
      res.status(200)
        .send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        throw new BadRequestError('Data  error');
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error('Server error');
      }
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  userModel.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User is not found');
      }
      res.status(200)
        .send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        throw new BadRequestError('Data  error');
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error('Server error');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Wrong data');
  }

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      userModel.findById(user._id)
        .then((data) => res.status(200)
          .send(data));
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000 && err.keyPattern.email) {
        throw new UnauthorizedErr('User with the specified email already exists ');
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Wrong data');
      } else {
        throw new Error('Server error');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const {
    name,
    about,
  } = req.body;
  if (!name || !about) {
    throw new BadRequestError('Wrong data');
  }
  userModel.findByIdAndUpdate(id, {
    name,
    about,
  }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200)
        .send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Ошибка получения данных'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User is not found');
      }
      res.status(200)
        .send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Wrong data'));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Wrong data'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  login,
  getUser,
  getCurrentUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
