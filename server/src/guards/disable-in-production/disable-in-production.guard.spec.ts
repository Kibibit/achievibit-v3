import { DisableInProductionGuard } from './disable-in-production.guard';

describe('DisableInProductionGuard', () => {
  it('should be defined', () => {
    expect(new DisableInProductionGuard()).toBeDefined();
  });
});
