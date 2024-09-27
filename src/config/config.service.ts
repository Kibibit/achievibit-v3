/* eslint-disable no-process-env */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService, IConfigServiceOptions } from '@kibibit/configit';

import { AchievibitConfig } from './achievibit.config';

const ENV_DEFAULT = 'development';

const nodeEnv = process.env.NODE_ENV || ENV_DEFAULT;

export class KbConfigService extends ConfigService<AchievibitConfig> {
  logger: any;
  isDevelopmentMode = this.config.NODE_ENV !== 'development';
  isProductionMode = this.config.NODE_ENV === 'production';

  constructor(passedConfig?: Partial<AchievibitConfig>, options: IConfigServiceOptions = {}) {
    super(AchievibitConfig, passedConfig, {
      skipSchema: nodeEnv !== 'development',
      ...options
    });
  }

  public getTypeOrmPostgresConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      // name: 'postgres',

      host: this.config.POSTGRES_HOST,
      port: this.config.POSTGRES_PORT,
      username: this.config.POSTGRES_USER,
      password: this.config.POSTGRES_PASSWORD,
      database: this.config.POSTGRES_DATABASE,

      entities: [ '**/*.entity{.ts,.js}' ],

      migrationsTableName: 'migration',

      migrations: [ 'src/migration/*.ts' ],

      // cli: {
      //   migrationsDir: 'src/migration'
      // },

      ssl: this.isProductionMode,

      synchronize: true,
      logging: true
    };
  }
}

export const configService = new KbConfigService() as KbConfigService;
