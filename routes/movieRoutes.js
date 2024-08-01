const express = require('express');
const { searchMovies, getMoviePlatforms, getAllMovies } = require('../controllers/movieController');
const router = express.Router();

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/:id/platforms', getMoviePlatforms);


module.exports = router;
