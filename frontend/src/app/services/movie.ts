import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieResponse } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/api/movies';

  constructor(private http: HttpClient) { }

  getMovies(page: number = 1, limit: number = 20): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<MovieResponse>(this.apiUrl, { params });
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  searchMovies(query: string): Observable<MovieResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<MovieResponse>(`${this.apiUrl}/search`, { params });
  }
}