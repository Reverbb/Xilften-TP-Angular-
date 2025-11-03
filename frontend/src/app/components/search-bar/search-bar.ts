import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery: string = '';
  private searchTimeout: any;

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onInput(): void {

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (this.searchQuery.length === 0) {
      this.search.emit('');
      return;
    }

    // Recherche automatique après 500ms d'inactivité
    if (this.searchQuery.length >= 2) {
      this.searchTimeout = setTimeout(() => {
        this.search.emit(this.searchQuery);
      }, 500);
    }
  }
}