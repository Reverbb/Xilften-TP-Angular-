import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss'
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID du film:', id);
    if (id) {
      this.loadMovie(+id);
    }
  }

  loadMovie(id: number): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        console.log('Film reçu:', movie);
        console.log('Poster URL:', movie.posterUrl);
        this.movie = movie;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du film:', error);
        this.error = true;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }

  getGenreList(): string[] {
    if (!this.movie?.genres) return [];
    return this.movie.genres.split('|').filter(g => g.trim());
  }

  openImdb(): void {
    if (this.movie?.imdbLink) {
      window.open(this.movie.imdbLink, '_blank');
    }
  }
}