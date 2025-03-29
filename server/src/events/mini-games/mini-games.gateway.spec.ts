import { Test, TestingModule } from '@nestjs/testing';
import { MiniGamesGateway } from './mini-games.gateway';

describe('MiniGamesGateway', () => {
  let gateway: MiniGamesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiniGamesGateway],
    }).compile();

    gateway = module.get<MiniGamesGateway>(MiniGamesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
