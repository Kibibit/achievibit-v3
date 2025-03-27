import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'kb-user-lives',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './user-lives.component.html',
  styleUrl: './user-lives.component.scss'
})
export class UserLivesComponent {
  private internalCurrentLives = 4;
  totalLives = 4;
  emptyLives = 0;
  // currentLives getter and setter
  @Input()
  get currentLives() {
    return this.internalCurrentLives;
  }
  set currentLives(value: number) {
    this.internalCurrentLives = value;
    const lifeDelta = this.totalLives - value;
    this.emptyLives = lifeDelta > 0 ? lifeDelta : 0;
  }
}
