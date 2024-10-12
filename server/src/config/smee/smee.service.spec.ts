import { Test, TestingModule } from '@nestjs/testing';

import { SmeeService } from './smee.service';

describe('SmeeService', () => {
  let service: SmeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ SmeeService ]
    }).compile();

    service = module.get<SmeeService>(SmeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
