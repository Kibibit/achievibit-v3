import { animate, style, transition, trigger } from '@angular/animations';

// add a delay to the fade in animation
export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, bottom: '-20px' }),
    animate('300ms 300ms ease-in', style({ opacity: 1, bottom: '0px' }))
  ]),
  transition(':leave', [
    style({ opacity: 1, bottom: '0px' }),
    animate('300ms ease-out', style({ opacity: 0, bottom: '20px' }))
  ])
]);
