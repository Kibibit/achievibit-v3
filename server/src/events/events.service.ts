import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Achievement } from '@kb-models';
import { SystemEventsGateway } from './system-events.gateway';

@Injectable()
export class EventsService {
  constructor(
    @Inject(forwardRef(() => EventsGateway))
    private readonly eventsGateway: EventsGateway,
    
    @Inject(forwardRef(() => SystemEventsGateway))
    private readonly systemEventsGateway: SystemEventsGateway
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
  
  /**
   * Broadcasts a test results refresh event to all connected clients
   * @param timestamp Timestamp to include in the event data
   */
  broadcastTestResultsRefresh(timestamp?: string) {
    if (!this.systemEventsGateway?.server) {
      throw new Error('System events gateway or server not available');
    }
    
    const eventData = { 
      timestamp: timestamp || new Date().toISOString() 
    };
    
    this.systemEventsGateway.server.emit('refresh-test-results', eventData);
    return eventData;
  }
}
