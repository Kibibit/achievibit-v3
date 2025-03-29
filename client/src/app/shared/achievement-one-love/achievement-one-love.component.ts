import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Achievement } from '@kibibit/achievibit-sdk';

import { AnAchievementComponent } from '../an-achievement/an-achievement.component';

@Component({
  selector: 'kb-achievement-one-love',
  standalone: true,
  imports: [ NgIf, AnAchievementComponent ],
  templateUrl: './achievement-one-love.component.html',
  styleUrl: './achievement-one-love.component.scss'
})
export class AchievementOneLoveComponent {
  @Input() achievement!: Partial<Achievement>;
}
