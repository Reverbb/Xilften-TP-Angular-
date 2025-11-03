const express = require('express');
const router = express.Router();

console.log('🔍 Chargement du contrôleur...');
const controller = require('../controllers/movieController');
console.log('📦 Contrôleur chargé:', controller);

const {
  getAllMovies,
  getMovieById,
  searchMovies
} = controller;

console.log('✅ getAllMovies:', typeof getAllMovies);
console.log('✅ getMovieById:', typeof getMovieById);
console.log('✅ searchMovies:', typeof searchMovies);

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

module.exports = router;