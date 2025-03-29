import { minidenticon } from 'minidenticons';
import { Component, computed, Input } from '@angular/core';

@Component({
  selector: 'kb-minidenticon-avatar',
  standalone: true,
  imports: [],
  templateUrl: './minidenticon-avatar.component.html',
  styleUrl: './minidenticon-avatar.component.scss'
})
export class MinidenticonAvatarComponent {
  @Input({ required: true }) name!: string;
  @Input() size = 64;

  svg = computed(() => minidenticon(this.name));
}
