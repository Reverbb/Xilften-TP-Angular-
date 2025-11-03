const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

let moviesCache = null;

const loadMovies = () => {
  return new Promise((resolve, reject) => {
    if (moviesCache) {
      return resolve(moviesCache);
    }

    const movies = [];
    const csvPath = path.join(__dirname, '../../data/movie_metadata.csv');

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        movies.push({
          id: movies.length + 1,
          title: row.movie_title ? row.movie_title.trim() : '',
          year: row.title_year || '',
          director: row.director_name || '',
          duration: row.duration || '',
          genres: row.genres || '',
          language: row.language || '',
          country: row.country || '',
          contentRating: row.content_rating || '',
          budget: row.budget || '',
          gross: row.gross || '',
          imdbScore: parseFloat(row.imdb_score) || 0,
          numVotedUsers: parseInt(row.num_voted_users) || 0,
          actor1: row.actor_1_name || '',
          actor2: row.actor_2_name || '',
          actor3: row.actor_3_name || '',
          plotKeywords: row.plot_keywords || '',
          imdbLink: row.movie_imdb_link || '',
          color: row.color || '',
          aspectRatio: row.aspect_ratio || '',
          facebookLikes: parseInt(row.movie_facebook_likes) || 0
        });
      })
      .on('end', () => {
        moviesCache = movies;
        console.log(`✅ ${movies.length} films chargés depuis le CSV`);
        resolve(movies);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = { loadMovies };