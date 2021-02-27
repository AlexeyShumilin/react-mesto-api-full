const cardModel = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((data) => res.status(200)
      .send(data))
    .catch(next);
};

const createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  cardModel.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(200)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Incorrect data');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  cardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not found');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Permission denied');
      }
      cardModel.findByIdAndRemove(cardId)
        .then((data) => res.status(200)
          .send(data));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Wrong data'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  cardModel.findByIdAndUpdate(cardId,
    { $addToSet: { likes: userId } },
    { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Not found');
      }
      res.status(200)
        .send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Wrong data'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  cardModel.findByIdAndUpdate(cardId,
    { $pull: { likes: userId } },
    { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Wrong data');
      }
      res.status(200)
        .send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Wrong data'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
