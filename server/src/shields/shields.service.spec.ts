import { Test, TestingModule } from '@nestjs/testing';

import { ShieldsService } from './shields.service';

describe('ShieldsService', () => {
  let service: ShieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ ShieldsService ]
    }).compile();

    service = module.get<ShieldsService>(ShieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
