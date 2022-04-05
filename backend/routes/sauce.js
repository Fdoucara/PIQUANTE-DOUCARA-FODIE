const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', auth, multer, sauceCtrl.getAllSauces);
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.updateOneSauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteOneSauce);

module.exports = router;