import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';

import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'kb-mini-game',
  standalone: true,
  imports: [],
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.scss'
})
export class MiniGameComponent implements OnDestroy {
  private readonly userMiniGamesRoomEvents$ = this.socketService.joinUserMiniGamesRoom();
  private userMiniGamesRoomEventsSubscription!: Subscription;

  constructor(
    private readonly socketService: SocketService
  ) {
    // Join the mini-game room
    this.joinUserMiniGamesRoom();
  }

  ngOnDestroy() {
    // Unsubscribe from the socket events if needed
    this.socketService.leaveUserMiniGamesRoom();
    this.userMiniGamesRoomEventsSubscription?.unsubscribe();
  }

  private joinUserMiniGamesRoom() {
    this.userMiniGamesRoomEventsSubscription = this.userMiniGamesRoomEvents$
      .subscribe({
        next: (response) => {
          console.log('Mini Game Event!', response);
        },
        error: (error) => {
          console.error('Error joining mini-game room:', error);
        }
      });
  }
}
