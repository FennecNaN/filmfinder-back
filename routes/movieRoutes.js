const express = require('express');
const { getAllMovies, getMovieCount, searchMovies, getMoviePlatforms } = require('../controllers/movieController');
const router = express.Router();

router.get('/', getAllMovies);
router.get('/count', getMovieCount);
router.get('/search', searchMovies);
router.get('/:id/platforms', getMoviePlatforms);

module.exports = router;