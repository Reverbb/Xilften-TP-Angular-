import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-loader.html',
  styleUrl: './intro-loader.scss'
})
export class IntroLoaderComponent implements OnInit {
  @Output() introComplete = new EventEmitter<void>();
  isVisible = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('🎬 INTRO STARTED');
    this.startIntro();
  }

  private async startIntro(): Promise<void> {
    await this.delay(5000);
    
    console.log('⏱️ Starting fade out...');
    this.isVisible = false;
    this.cdr.markForCheck();
    
    await this.delay(1000);
    
    console.log('✅ INTRO COMPLETE');
    this.introComplete.emit();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}