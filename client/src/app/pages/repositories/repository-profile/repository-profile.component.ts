import { delay, from, fromEvent, tap } from 'rxjs';
import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Repository } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../../services/socket.service';
import { fadeInUp } from '../../../shared/achievement/fade-in-up.animation';
import { AnAchievementComponent } from '../../../shared/an-achievement/an-achievement.component';

@Component({
  selector: 'kb-repository-profile',
  standalone: true,
  imports: [ NgIf, AnAchievementComponent, RouterLink ],
  animations: [ fadeInUp ],
  templateUrl: './repository-profile.component.html',
  styleUrl: './repository-profile.component.scss'
})
export class RepositoryProfileComponent implements OnDestroy {
  private readonly dataKey = 'repository';
  private readonly handleNewAchievement = this.onNewAchievement.bind(this);
  repo!: Repository;
  initials: string = '';
  achievementNotification: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly socketService: SocketService
  ) {
    this.repo = this.route.snapshot.data[this.dataKey];
    this.initials = this.repo.fullname.toUpperCase().split('/').map((word) => word[0]).join('');

    this.socketService.joinRepositoryAchievementRoom(this.repo.fullname);
    this.socketService.onAchievement(this.repo.fullname, this.handleNewAchievement);
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.repo.fullname, this.handleNewAchievement);
    this.socketService.leaveRepositoryAchievementRoom(this.repo.fullname);
  }

  private onNewAchievement(achievement: any) {
    // load image for achievement before showing it
    const img = new Image();
    const onLoad$ = fromEvent(img, 'load');
    const onError$ = fromEvent(img, 'error');

    onLoad$.subscribe(() => {
      console.log(`🎖️ New achievement for the ${ this.repo.name } repository:`, achievement);
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
