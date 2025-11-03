const { loadMovies } = require('../utils/csvReader');
const { searchMoviePoster } = require('../services/tmdbService');

const MAX_MOVIES = 500;

const getAllMovies = async (req, res) => {
  try {
    const allMovies = await loadMovies();
    const limitedMovies = allMovies.slice(0, MAX_MOVIES);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedMovies = limitedMovies.slice(startIndex, endIndex);

    const moviesWithImages = await Promise.all(
      paginatedMovies.map(async (movie) => {
        const posterUrl = await searchMoviePoster(movie.title, movie.year);
        return {
          ...movie,
          posterUrl: posterUrl
        };
      })
    );

    res.json({
      total: limitedMovies.length,
      page,
      limit,
      totalPages: Math.ceil(limitedMovies.length / limit),
      data: moviesWithImages
    });
  } catch (error) {
    console.error('Erreur getAllMovies:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des films' });
  }
};

const getMovieById = async (req, res) => {
  try {
    const allMovies = await loadMovies();
    const limitedMovies = allMovies.slice(0, MAX_MOVIES);
    const movie = limitedMovies.find(m => m.id === parseInt(req.params.id));

    if (!movie) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    const posterUrl = await searchMoviePoster(movie.title, movie.year);
    const movieWithImage = {
      ...movie,
      posterUrl: posterUrl
    };

    res.json(movieWithImage);
  } catch (error) {
    console.error('Erreur getMovieById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du film' });
  }
};

const searchMovies = async (req, res) => {
  try {
    const allMovies = await loadMovies();
    const limitedMovies = allMovies.slice(0, MAX_MOVIES);
    const query = req.query.q ? req.query.q.toLowerCase() : '';

    const filteredMovies = limitedMovies.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.director.toLowerCase().includes(query) ||
      movie.genres.toLowerCase().includes(query) ||
      (movie.actor1 && movie.actor1.toLowerCase().includes(query)) ||
      (movie.actor2 && movie.actor2.toLowerCase().includes(query))
    );

    const moviesWithImages = await Promise.all(
      filteredMovies.map(async (movie) => {
        const posterUrl = await searchMoviePoster(movie.title, movie.year);
        return {
          ...movie,
          posterUrl: posterUrl
        };
      })
    );

    res.json({
      total: moviesWithImages.length,
      data: moviesWithImages
    });
  } catch (error) {
    console.error('Erreur searchMovies:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  searchMovies
};