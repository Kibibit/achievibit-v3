import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Achievement } from '@kibibit/achievibit-sdk';

@Component({
  selector: 'kb-achievement-one-love',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './achievement-one-love.component.html',
  styleUrl: './achievement-one-love.component.scss'
})
export class AchievementOneLoveComponent {
  @Input() achievement!: Partial<Achievement>;
}
