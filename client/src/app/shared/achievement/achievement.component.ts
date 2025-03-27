import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Achievement } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'kb-achievement',
  standalone: true,
  imports: [ NgFor ],
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
      console.log(`🎖️ New achievement for ${ this.username }:`, achievement);

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
  }
}
