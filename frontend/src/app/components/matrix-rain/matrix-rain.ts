import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matrix-rain',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matrix-rain.html',
  styleUrl: './matrix-rain.scss'
})
export class MatrixRainComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;
  private columns: number = 0;
  private drops: number[] = [];
  private fontSize = 16;

  ngOnInit(): void {
    this.initCanvas();
    this.startRain();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    this.ctx = canvas.getContext('2d')!;
    this.columns = Math.floor(canvas.width / this.fontSize);
    
    // Initialise les gouttes
    this.drops = Array(this.columns).fill(1);
    
    // Redimensionne le canvas si la fenêtre change
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.columns = Math.floor(canvas.width / this.fontSize);
      this.drops = Array(this.columns).fill(1);
    });
  }

  private startRain(): void {
    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
    
    const draw = () => {
      // Effet de fondu
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      
      this.ctx.fillStyle = '#0f0'; // Vert Matrix
      this.ctx.font = `${this.fontSize}px monospace`;
      
      for (let i = 0; i < this.drops.length; i++) {
        // Caractère aléatoire
        const text = matrix.charAt(Math.floor(Math.random() * matrix.length));
        const x = i * this.fontSize;
        const y = this.drops[i] * this.fontSize;
        
        this.ctx.fillText(text, x, y);
        
        // Réinitialise la goutte aléatoirement
        if (y > this.canvasRef.nativeElement.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        
        this.drops[i]++;
      }
      
      this.animationId = requestAnimationFrame(draw);
    };
    
    draw();
  }
}