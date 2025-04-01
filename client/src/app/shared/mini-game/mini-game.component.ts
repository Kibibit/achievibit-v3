import { Subscription } from 'rxjs';
import { Component, HostBinding, OnDestroy } from '@angular/core';

import { SocketService } from '../../services/socket.service';
import { UserLivesComponent } from '../user-lives/user-lives.component';

@Component({
  selector: 'kb-mini-game',
  standalone: true,
  imports: [ UserLivesComponent ],
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.scss'
})
export class MiniGameComponent implements OnDestroy {
  private readonly userMiniGamesRoomEvents$ = this.socketService.joinUserMiniGamesRoom();
  private userMiniGamesRoomEventsSubscription!: Subscription;

  userLives = 3;

  @HostBinding('class.kb-show') showMiniGame = false;

  constructor(
    private readonly socketService: SocketService
  ) {
    // Join the mini-game room
    this.joinUserMiniGamesRoom();

    this.socketService.on('test-test-test-do-it')
      .subscribe(() => {
        this.showMiniGame = true;
        console.log('Mini game triggered!');
      });
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
