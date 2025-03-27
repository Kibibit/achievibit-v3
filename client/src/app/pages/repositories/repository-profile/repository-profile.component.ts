import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Repository } from '@kibibit/achievibit-sdk';

import { SocketService } from '../../../services/socket.service';
import { AchievementOneLoveComponent } from '../../../shared/achievement-one-love/achievement-one-love.component';

@Component({
  selector: 'kb-repository-profile',
  standalone: true,
  imports: [ NgIf, AchievementOneLoveComponent, RouterLink ],
  templateUrl: './repository-profile.component.html',
  styleUrl: './repository-profile.component.scss'
})
export class RepositoryProfileComponent implements OnDestroy {
  private readonly dataKey = 'repository';
  private readonly handleNewAchievement = this.onNewAchievement.bind(this);
  repo!: Repository;
  achievementNotification: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly socketService: SocketService
  ) {
    this.repo = this.route.snapshot.data[this.dataKey];

    this.socketService.joinOrganizationAchievementRoom(this.repo.name);
    this.socketService.onAchievement(this.repo.name, this.handleNewAchievement);
  }

  ngOnDestroy() {
    this.socketService.offAchievement(this.repo.name, this.handleNewAchievement);
    this.socketService.leaveOrganizationAchievementRoom(this.repo.name);
  }

  private onNewAchievement(achievement: any) {
    console.log(`🎖️ New achievement for the ${ this.repo.name } organization:`, achievement);
    this.achievementNotification = achievement;
  }
}
