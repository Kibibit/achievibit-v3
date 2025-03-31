import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Achievement } from '@kb-models';

@Injectable()
export class EventsService {
  constructor(
    @Inject(forwardRef(() => EventsGateway))
    private readonly eventsGateway: EventsGateway
  ) {}

  sendAchievementToOrg(orgName: string, achievement: Partial<Achievement>) {
    this.eventsGateway.sendAchievementToOrg(orgName, achievement);
  }

  sendAchievementToRepo(repoId: string, achievement: Partial<Achievement>) {
    this.eventsGateway.sendAchievementToRepo(repoId, achievement);
  }

  sendAchievementToUser(username: string, achievement: Partial<Achievement>) {
    this.eventsGateway.sendAchievementToUser(username, achievement);
  }
}
