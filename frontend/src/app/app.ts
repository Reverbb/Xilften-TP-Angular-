import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IntroLoaderComponent } from './components/intro-loader/intro-loader';
import { MatrixRainComponent } from './components/matrix-rain/matrix-rain';
import { KonamiService } from './services/konami';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IntroLoaderComponent, MatrixRainComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  showIntro = true;
  matrixMode = false;

  constructor(
    private konamiService: KonamiService,
    private cdr: ChangeDetectorRef
  ) {
    this.konamiService.matrixMode$.subscribe(isActive => {
      console.log('🎮 Matrix mode changé:', isActive);
      this.matrixMode = isActive;
      if (isActive) {
        document.body.classList.add('matrix-mode');
      } else {
        document.body.classList.remove('matrix-mode');
      }
      this.cdr.markForCheck(); // Force la détection de changement
    });
  }

  onIntroComplete(): void {
    this.showIntro = false;
    this.cdr.markForCheck();
  }
}