const {
  celebrate,
  Joi,
} = require('celebrate');

const checkUserId = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .alphanum()
        .length(24),
    }),
});

const checkUpdateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
});

const checkUpdateAvatar = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .pattern(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i),
    }),
});

const checkLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});

const checkRegister = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .pattern(/^[A-Za-z0-9]/i),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i),
    }),
});

module.exports = {
  checkUserId,
  checkUpdateUser,
  checkUpdateAvatar,
  checkLogin,
  checkRegister,
};
