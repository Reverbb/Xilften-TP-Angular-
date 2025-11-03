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
    const query = req.query.q ? req.query.q.toLowerCase().trim() : '';

    if (!query) {
      return res.json({
        total: 0,
        data: []
      });
    }

    const filteredMovies = limitedMovies.filter(movie => {
      const searchFields = [
        movie.title.toLowerCase(),
        movie.director.toLowerCase(),
        movie.genres.toLowerCase(),
        movie.actor1 ? movie.actor1.toLowerCase() : '',
        movie.actor2 ? movie.actor2.toLowerCase() : '',
        movie.actor3 ? movie.actor3.toLowerCase() : '',
        movie.plotKeywords ? movie.plotKeywords.toLowerCase() : ''
      ].join(' ');

      return searchFields.includes(query);
    });

    const sortedMovies = filteredMovies.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Priorité 1 : Titre commence par la query
      const aStartsWith = aTitle.startsWith(query);
      const bStartsWith = bTitle.startsWith(query);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Priorité 2 : Titre contient la query en début de mot
      const aWordStart = aTitle.includes(' ' + query) || aTitle.startsWith(query);
      const bWordStart = bTitle.includes(' ' + query) || bTitle.startsWith(query);
      if (aWordStart && !bWordStart) return -1;
      if (!aWordStart && bWordStart) return 1;
      
      // Priorité 3 : Note IMDb (meilleurs films en premier)
      return b.imdbScore - a.imdbScore;
    });

    const moviesWithImages = await Promise.all(
      sortedMovies.map(async (movie) => {
        const posterUrl = await searchMoviePoster(movie.title, movie.year);
        return {
          ...movie,
          posterUrl: posterUrl || `https://placehold.co/300x450/e50914/ffffff?text=${encodeURIComponent(movie.title.substring(0, 20))}`
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