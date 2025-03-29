import { Component, Input } from '@angular/core';

import { Achievement } from '@kibibit/achievibit-sdk';

@Component({
  selector: 'kb-an-achievement',
  standalone: true,
  imports: [],
  templateUrl: './an-achievement.component.html',
  styleUrl: './an-achievement.component.scss'
})
export class AnAchievementComponent {
  @Input() achievement!: Partial<Achievement>;
}
