import { DataSource } from 'typeorm';

import { configService } from '@kb-config';

const typeOrmModuleOptions = configService.getTypeOrmPostgresConfig() as any;

export default new DataSource({
  ...typeOrmModuleOptions,
  synchronize: false,
  logging: false
});
