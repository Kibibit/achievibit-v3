import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { User, UserPermissionsEnum, UserRolesEnum } from '@kibibit/achievibit-sdk';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRolesEnum): boolean {
    return this.currentUserSubject.value?.roles.includes(role) ?? false;
  }

  hasPermission(permission: UserPermissionsEnum): boolean {
    return this.currentUserSubject.value?.permissions.includes(permission) ?? false;
  }
}
