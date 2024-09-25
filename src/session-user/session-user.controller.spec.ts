import { Test, TestingModule } from '@nestjs/testing';
import { SessionUserController } from './session-user.controller';

describe('SessionUserController', () => {
  let controller: SessionUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionUserController],
    }).compile();

    controller = module.get<SessionUserController>(SessionUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
