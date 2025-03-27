import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../../services/socket.service';
import { AchievementOneLoveComponent } from '../../../shared/achievement-one-love/achievement-one-love.component';


@Component({
  selector: 'kb-user-profile',
  standalone: true,
  imports: [ NgIf, AsyncPipe, AchievementOneLoveComponent, RouterLink ],
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

    this.socketService.joinAchievementRoom(this.user.username);
    this.socketService.onAchievement(this.user.username, this.handleNewAchievement);
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.user.username, this.handleNewAchievement);
    this.socketService.leaveAchievementRoom(this.user.username);
  }

  private onNewAchievement(achievement: any) {
    console.log(`🎖️ New achievement for ${ this.user.username }:`, achievement);
    this.achievementNotification = achievement;
  }
}
