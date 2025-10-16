import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verfiyCodeGuardGuard } from './verfiy-code-guard-guard';

describe('verfiyCodeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => verfiyCodeGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
