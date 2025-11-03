import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KonamiService {
  private konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ];
  
  private userInput: string[] = [];
  private matrixMode = new BehaviorSubject<boolean>(false);
  
  public matrixMode$ = this.matrixMode.asObservable();

  constructor() {
    this.initKonamiListener();
    this.initEscapeListener();
  }

  private initKonamiListener(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      // Ignore Escape pour le code Konami
      if (event.key === 'Escape') return;
      
      this.userInput.push(event.key);
      
      if (this.userInput.length > 10) {
        this.userInput.shift();
      }
      
      if (this.checkKonamiCode()) {
        console.log('🎮 KONAMI CODE ACTIVATED! 🎮');
        this.activateMatrixMode();
      }
    });
  }

  private initEscapeListener(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.matrixMode.value) {
        console.log('🚪 Mode Matrix désactivé avec Escape');
        this.deactivateMatrixMode();
      }
    });
  }

  private checkKonamiCode(): boolean {
    return this.konamiCode.every((key, index) => key === this.userInput[index]);
  }

  private activateMatrixMode(): void {
    this.matrixMode.next(true);
    this.playMatrixSound();
    this.showActivationMessage();
  }

  private deactivateMatrixMode(): void {
    this.matrixMode.next(false);
    this.showDeactivationMessage();
  }

  private playMatrixSound(): void {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LZjHAU5k9n0y3krBSd6yO/ekDwJFF+y5+usWBMJR6Hf8rxqIAUsgs/y2Ik2Bx';
    audio.play().catch(() => {});
  }

  private showActivationMessage(): void {
    const message = document.createElement('div');
    message.className = 'konami-message';
    message.innerHTML = `
      <div class="konami-content">
        <h1>🎮 MODE MATRIX ACTIVÉ 🎮</h1>
        <p>Bienvenue dans la Matrice...</p>
        <p class="hint">Appuyez sur <kbd>ESC</kbd> pour quitter</p>
      </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 1000);
    }, 3000);
  }

  private showDeactivationMessage(): void {
    const message = document.createElement('div');
    message.className = 'konami-message deactivate';
    message.innerHTML = `
      <div class="konami-content">
        <h1>👋 MODE MATRIX DÉSACTIVÉ</h1>
        <p>Retour à la réalité...</p>
      </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 1000);
    }, 2000);
  }

  isMatrixMode(): boolean {
    return this.matrixMode.value;
  }
}