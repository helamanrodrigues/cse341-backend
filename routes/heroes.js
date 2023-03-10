const express = require('express');
const router = express.Router();

const heroesController = require('../controllers/heroes');
const validation = require('../middleware/validate');

router.get('/', heroesController.getAll);

router.get('/:id', heroesController.getSingle);

router.post('/', validation.saveHero, heroesController.createHero);

router.put('/:id', validation.saveHero, heroesController.updateHero);

router.delete('/:id', heroesController.deleteHero);

module.exports = router;
