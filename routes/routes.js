const { Router } = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const animeController = require('../controllers/animeController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.post('/sign-up', authController.signup);

router.post('/log-in', authController.login);

router.post('/log-out', requireAuth, authController.logout);

/*
* UserController routes
*/

router.get('/user', requireAuth, userController.index);
router.post('/user', requireAuth, userController.store);
router.patch('/user/update-password/:id', requireAuth, userController.update_password);
router.get('/user/:id', requireAuth, userController.show);
router.patch('/user/:id', requireAuth, userController.update);
router.delete('/user/:id', requireAuth, userController.destroy);

/*
* AnimeController routes
*/

router.get('/anime', requireAuth, animeController.season_anime);
router.post('/anime/picture/upload', requireAuth, animeController.upload);
router.get('/anime/picture/:type/:season', requireAuth, animeController.fetch_picture);
router.post('/anime/vote/:season/:year', requireAuth, animeController.vote);

module.exports = router;