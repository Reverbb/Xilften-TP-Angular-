import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(page: number = 1): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.movieService.getMovies(page, 20).subscribe({
      next: (response) => {
        console.log('Films reçus:', response);
        this.movies = response.data;
        this.filteredMovies = response.data;
        this.currentPage = response.page || 1;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des films:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSearch(query: string): void {
    if (!query || query.trim() === '') {
      this.filteredMovies = this.movies;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();
    
    this.movieService.searchMovies(query).subscribe({
      next: (response) => {
        this.filteredMovies = response.data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 7;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadMovies(page);
      window.scrollTo(0, 0);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadMovies(this.currentPage + 1);
      window.scrollTo(0, 0);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadMovies(this.currentPage - 1);
      window.scrollTo(0, 0);
    }
  }
}