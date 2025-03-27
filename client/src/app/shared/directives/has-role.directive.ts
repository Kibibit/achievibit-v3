import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserRolesEnum } from '@kibibit/achievibit-sdk';

import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[kbHasRole]',
  standalone: true
})
export class KbHasRoleDirective {
  @Input() set hasRole(role: keyof typeof UserRolesEnum) {
    const has = this.auth.hasRole(UserRolesEnum[role]);
    if (has) {
      this.vc.createEmbeddedView(this.templateRef);
    } else {
      this.vc.clear();
    }
  }

  constructor(
    private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private vc: ViewContainerRef
  ) {}
}
