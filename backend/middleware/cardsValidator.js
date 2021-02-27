const {
  celebrate,
  Joi,
} = require('celebrate');

const checkCard = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      link: Joi.string()
        .pattern(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i),
    }),
});

const checkCardId = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
});

module.exports = {
  checkCard,
  checkCardId,
};
