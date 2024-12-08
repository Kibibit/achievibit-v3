import { Test, TestingModule } from '@nestjs/testing';
import { GrowthbookService } from './growthbook.service';

describe('GrowthbookService', () => {
  let service: GrowthbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrowthbookService],
    }).compile();

    service = module.get<GrowthbookService>(GrowthbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
