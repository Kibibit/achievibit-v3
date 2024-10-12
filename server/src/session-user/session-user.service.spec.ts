import { Test, TestingModule } from '@nestjs/testing';

import { SessionUserService } from './session-user.service';

describe('SessionUserService', () => {
  let service: SessionUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ SessionUserService ]
    }).compile();

    service = module.get<SessionUserService>(SessionUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
