import { delay, from, tap } from 'rxjs';
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

    this.socketService
      .getSocketConnectionStatus()
      .subscribe((status) => {
        if (!status.connected) {
          return;
        }

        this.socketService.joinRepositoryAchievementRoom(this.repo.fullname);
        this.socketService.onAchievement(this.repo.fullname, this.handleNewAchievement);
      });
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.repo.fullname, this.handleNewAchievement);
    this.socketService.leaveRepositoryAchievementRoom(this.repo.fullname);
  }

  private onNewAchievement(achievement: any) {
    console.log(`🎖️ New achievement for the ${ this.repo.name } repository:`, achievement);
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
