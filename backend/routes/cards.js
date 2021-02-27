const router = require('express')
  .Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  checkCard,
  checkCardId,
} = require('../middleware/cardsValidator');

router.get('/', getCards);
router.post('/', checkCard, createCard);
router.delete('/:cardId', checkCardId, deleteCardById);
router.put('/:cardId/likes', checkCardId, likeCard);
router.delete('/:cardId/likes', checkCardId, dislikeCard);

module.exports = router;
