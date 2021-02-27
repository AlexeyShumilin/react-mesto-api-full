const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const BadRequestError = require('../errors/bad-request-err');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques-Yves Cousteau ',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ocean explorer ',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/gi.test(v);
      },
      message: 'Invalid URL ',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Incorrect email ',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequestError('Incorrect email or password '));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequestError('Incorrect email or password '));
          }
          return user;
        });
    });
};

const userModel = mongoose.model('user', UserSchema);
module.exports = userModel;
