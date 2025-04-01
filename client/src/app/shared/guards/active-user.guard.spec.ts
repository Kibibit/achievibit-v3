import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activeUserGuard } from './active-user.guard';

describe('activeUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => activeUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
