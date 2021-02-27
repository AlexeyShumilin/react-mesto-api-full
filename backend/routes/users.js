const router = require('express')
  .Router();

const {
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  checkUserId,
  checkUpdateUser,
  checkUpdateAvatar,
} = require('../middleware/usersValidator');

router.get('/', getUser);
router.get('/me', getCurrentUser);
router.get('/:userId', checkUserId, getUserById);
router.patch('/me', checkUpdateUser, updateUser);
router.patch('/me/avatar', checkUpdateAvatar, updateAvatar);

module.exports = router;
