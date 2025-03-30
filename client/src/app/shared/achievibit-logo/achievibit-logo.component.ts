import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GeneralApiService } from '../../services/api/general.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'kb-achievibit-logo',
  standalone: true,
  imports: [ RouterLink, NgIf ],
  templateUrl: './achievibit-logo.component.html',
  styleUrl: './achievibit-logo.component.scss'
})
export class AchievibitLogoComponent {
  private audio = new Audio('/api/pronunciation');

  apiVersion: string = '';
  shouldBlink: boolean = false;
  connected: boolean = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly generalApiService: GeneralApiService
  ) {
    this.handleVersionUpdates();

    this.socketService
      .getSocketConnectionStatus()
      .subscribe((status) => {
        this.connected = status.connected;

        // resubscribe
        this.handleVersionUpdates();
      });

    this.generalApiService.getApiDetails()
      .subscribe((details) => {
        if (this.apiVersion === details.version) {
          return;
        }

        this.apiVersion = details.version;
        this.shouldBlink = false;
      });
  }

  handleVersionUpdates(version?: string) {
    if (version) {
      this.apiVersion = version;
      this.shouldBlink = false;
    }

    this.socketService
      .on('version-update')
      .subscribe((data: { apiVersion: string }) => {
        if (this.apiVersion === data.apiVersion) {
          return;
        }

        this.apiVersion = data.apiVersion;
        this.shouldBlink = true;

        setTimeout(() => {
          this.shouldBlink = false;
        }, 3000);
      });
  }

  playSound() {
    // rewind if already playing
    this.audio.currentTime = 0;
    this.audio.play().catch((err) => {
      console.error('Audio play failed:', err);
    });
  }
}
