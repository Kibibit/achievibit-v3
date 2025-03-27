import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'kb-achievibit-logo',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './achievibit-logo.component.html',
  styleUrl: './achievibit-logo.component.scss'
})
export class AchievibitLogoComponent {
  private audio = new Audio('/api/pronunciation');

  playSound() {
    // rewind if already playing
    this.audio.currentTime = 0;
    this.audio.play().catch((err) => {
      console.error('Audio play failed:', err);
    });
  }
}
