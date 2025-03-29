import { delay, from, fromEvent, tap } from 'rxjs';
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

    this.socketService.joinAchievementRoom(this.user.username);
    this.socketService.onAchievement(this.user.username, this.handleNewAchievement);
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.user.username, this.handleNewAchievement);
    this.socketService.leaveAchievementRoom(this.user.username);
  }

  private onNewAchievement(achievement: any) {
    // load image for achievement before showing it
    const img = new Image();
    const onLoad$ = fromEvent(img, 'load');
    const onError$ = fromEvent(img, 'error');

    onLoad$.subscribe(() => {
      console.log(`🎖️ New USER achievement for ${ this.user.username }:`, achievement);
      from([ achievement ])
        .pipe(
          tap((a) => this.achievementNotification = a),
          delay(5000)
        )
        .subscribe(() => this.achievementNotification = null);
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
  }
}
