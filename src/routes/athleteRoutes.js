const express = require('express');
const router = express.Router();
const controller = require('../controllers/athleteController');

router.get('/', controller.getAll);
router.post('/', controller.addAthlete);
router.put('/:name', controller.updateAthlete);
router.delete('/:name', controller.deleteAthlete);

module.exports = router;