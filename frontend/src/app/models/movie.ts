export interface Movie {
  id: number;
  title: string;
  year: string;
  director: string;
  duration: string;
  genres: string;
  language: string;
  country: string;
  contentRating: string;
  budget: string;
  gross: string;
  imdbScore: number;
  numVotedUsers: number;
  actor1: string;
  actor2: string;
  actor3: string;
  plotKeywords: string;
  imdbLink: string;
  color: string;
  aspectRatio: string;
  facebookLikes: number;
  posterUrl?: string;
}

export interface MovieResponse {
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data: Movie[];
}