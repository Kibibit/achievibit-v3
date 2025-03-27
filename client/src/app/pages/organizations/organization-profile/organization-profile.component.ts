import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Organization } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../../services/socket.service';
import { AchievementOneLoveComponent } from '../../../shared/achievement-one-love/achievement-one-love.component';

@Component({
  selector: 'kb-organization-profile',
  standalone: true,
  imports: [ NgIf, AchievementOneLoveComponent, RouterLink ],
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

    this.socketService.joinOrganizationAchievementRoom(this.org.name);
    this.socketService.onAchievement(this.org.name, this.handleNewAchievement);
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.org.name, this.handleNewAchievement);
    this.socketService.leaveOrganizationAchievementRoom(this.org.name);
  }

  private onNewAchievement(achievement: any) {
    console.log(`🎖️ New achievement for the ${ this.org.name } organization:`, achievement);
    this.achievementNotification = achievement;
  }
}
