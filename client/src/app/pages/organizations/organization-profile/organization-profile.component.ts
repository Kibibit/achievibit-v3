import { delay, from, tap } from 'rxjs';
import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Organization } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../../services/socket.service';
import { fadeInUp } from '../../../shared/achievement/fade-in-up.animation';
import { AchievementOneLoveComponent } from '../../../shared/achievement-one-love/achievement-one-love.component';
import { AnAchievementComponent } from '../../../shared/an-achievement/an-achievement.component';

@Component({
  selector: 'kb-organization-profile',
  standalone: true,
  imports: [ NgIf, AchievementOneLoveComponent, RouterLink, AnAchievementComponent ],
  animations: [ fadeInUp ],
  templateUrl: './organization-profile.component.html',
  styleUrl: './organization-profile.component.scss'
})
export class OrganizationProfileComponent implements OnDestroy {
  private readonly dataKey = 'organization';
  private readonly handleNewAchievement = this.onNewAchievement.bind(this);
  org!: Organization;
  achievementNotification: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly socketService: SocketService
  ) {
    this.org = this.route.snapshot.data[this.dataKey];

    this.socketService
      .getSocketConnectionStatus()
      .subscribe((status) => {
        if (!status.connected) {
          return;
        }

        this.socketService.joinOrganizationAchievementRoom(this.org.name);
        this.socketService.onAchievement(this.org.name, this.handleNewAchievement);
      });
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.org.name, this.handleNewAchievement);
    this.socketService.leaveOrganizationAchievementRoom(this.org.name);
  }

  private onNewAchievement(achievement: any) {
    console.log(`🎖️ New achievement for the ${ this.org.name } organization:`, achievement);
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
