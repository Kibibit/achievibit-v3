import { fromEvent } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Achievement } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../services/socket.service';
import { AnAchievementComponent } from '../an-achievement/an-achievement.component';
import { fadeInUp } from './fade-in-up.animation';

@Component({
  selector: 'kb-achievement',
  standalone: true,
  imports: [ NgFor, AnAchievementComponent, NgIf ],
  animations: [ fadeInUp ],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent implements OnInit {
  @Input() username!: string;

  achievements: Partial<Achievement & { id: string }>[] = [];

  constructor(
    private readonly socketService: SocketService
  ) {}

  ngOnInit(): void {
    if (!this.username) {
      return;
    }

    this.socketService.joinAchievementRoom(this.username);

    this.socketService.onAchievement(this.username, (achievement) => {
      // load image for achievement before showing it
      const img = new Image();
      const onLoad$ = fromEvent(img, 'load');
      const onError$ = fromEvent(img, 'error');

      onLoad$.subscribe(() => {
        console.log(`🎖️ New LOGGED-IN USER achievement for ${ this.username }:`, achievement);

        // create an id based on achievement name and created at
        achievement.id = `${ achievement.name }-${ achievement.createdAt }`;

        if (this.achievements.find((a) => a.id === achievement.id)) {
          return;
        }

        this.achievements.unshift(achievement);

        setTimeout(() => {
          this.achievements = this.achievements.filter((a) => a.id !== achievement.id);
        }, 10000);
      });

      onError$.subscribe(() => {
        console.error(`🎖️ Error loading image for achievement: ${ achievement.avatar }`);
      });

      // Always set this AFTER subscriptions
      img.src = achievement.avatar;

      // Also check if it's cached and already loaded
      if (img.complete && img.naturalHeight !== 0) {
        // already loaded and good
        // manually trigger the same logic
        onLoad$.subscribe();
      }
    });
  }
}
