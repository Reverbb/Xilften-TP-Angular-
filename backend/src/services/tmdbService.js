const axios = require('axios');

const OMDB_API_KEY = '4610d51f';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

const imageCache = new Map();

const searchMoviePoster = async (title, year) => {
  const cacheKey = `${title}_${year}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const cleanTitle = title.replace(/\s+/g, ' ').trim();
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        t: cleanTitle,
        y: year,
        type: 'movie'
      }
    });

    if (response.data && response.data.Poster && response.data.Poster !== 'N/A') {
      const posterUrl = response.data.Poster;
      imageCache.set(cacheKey, posterUrl);
      return posterUrl;
    }
    
    const colors = ['e50914', 'f40612', '831010'];
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    const shortTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;
    const fallbackUrl = `https://placehold.co/300x450/${color}/ffffff?text=${encodeURIComponent(shortTitle)}`;
    imageCache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
    
  } catch (error) {
    const colors = ['e50914', 'f40612', '831010'];
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    const shortTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;
    return `https://placehold.co/300x450/${color}/ffffff?text=${encodeURIComponent(shortTitle)}`;
  }
};

module.exports = { searchMoviePoster }; 