import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { GeneralApiService } from '../../services/api/general.service';
import { HealthApiService } from '../../services/api/health.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'kb-app-status',
  standalone: true,
  imports: [ NgIf, AsyncPipe, NgFor, KeyValuePipe, DatePipe ],
  templateUrl: './app-status.component.html',
  styleUrl: './app-status.component.scss'
})
export class AppStatusComponent {
  healthCheck$ = this.healthApiService.healthCheck();
  apiDetails$ = this.generalApiService.getApiDetails();
  socketConnectionStatus$ = this.socketService.getSocketConnectionStatus();

  constructor(
    private readonly healthApiService: HealthApiService,
    private readonly generalApiService: GeneralApiService,
    private readonly socketService: SocketService
  ) {}

  triggerMiniGame() {
    this.socketService.emit('test-test-test', {}, () => {});
  }
}
