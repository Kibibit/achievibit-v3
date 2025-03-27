import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[kbBackButton]',
  standalone: true
})
export class BackButtonDirective {
  constructor(private router: Router) { }

  @HostListener('click')
  onClick() {
    this.router.navigate([ '..' ]);
  }
}
