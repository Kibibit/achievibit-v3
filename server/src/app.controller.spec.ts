import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmeeService } from '@kb-config';

jest.mock('fs-extra', () => ({
  readJSON: jest.fn().mockResolvedValue({
    name: 'test',
    description: 'test',
    version: 'test',
    license: 'test',
    repository: 'test',
  })
}));

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ AppController ],
      providers: [
        AppService,
        SmeeService
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(appController.getApiDetails()).resolves.toMatchSnapshot();
    });
  });
});
