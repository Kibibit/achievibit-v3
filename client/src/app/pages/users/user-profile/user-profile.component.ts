import { delay, from, tap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../../services/socket.service';
import { fadeInUp } from '../../../shared/achievement/fade-in-up.animation';
import { AnAchievementComponent } from '../../../shared/an-achievement/an-achievement.component';


@Component({
  selector: 'kb-user-profile',
  standalone: true,
  imports: [ NgIf, AsyncPipe, AnAchievementComponent, RouterLink ],
  animations: [ fadeInUp ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnDestroy {
  private readonly dataKey = 'user';
  private readonly handleNewAchievement = this.onNewAchievement.bind(this);
  user!: User;
  achievementNotification: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly socketService: SocketService
  ) {
    this.user = this.route.snapshot.data[this.dataKey];

    this.socketService
      .getSocketConnectionStatus()
      .subscribe((status) => {
        if (!status.connected) {
          return;
        }

        this.socketService.joinAchievementRoom(this.user.username);
        this.socketService.onAchievement(this.user.username, this.handleNewAchievement);
      });
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.user.username, this.handleNewAchievement);
    this.socketService.leaveAchievementRoom(this.user.username);
  }

  private onNewAchievement(achievement: any) {
    console.log(`🎖️ New USER achievement for ${ this.user.username }:`, achievement);
    const img = new Image();

    img.onload = () => {
      from([ achievement ])
        .pipe(
          tap((a) => this.achievementNotification = a),
          delay(5000)
        )
        .subscribe(() => this.achievementNotification = null);
    };

    img.onerror = () => {
      console.error(`🎖️ Error loading image for achievement: ${ achievement.avatar }`);
    };

    img.src = achievement.avatar;
  }
}
