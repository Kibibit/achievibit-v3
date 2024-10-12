import { DbExceptionFilter } from './db-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new DbExceptionFilter()).toBeDefined();
  });
});
