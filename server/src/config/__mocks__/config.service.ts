import { AchievibitConfig } from "../achievibit.config";

export class ConfigServiceMock {
  private _config: Partial<AchievibitConfig> = {};
  appRoot = 'root/';

  get config() {
    return this._config || {};
  }

  set config(config: Partial<AchievibitConfig>) {
    this._config = config;
  }

  clear() {
    this._config = {};
  }
}

export const configService = new ConfigServiceMock();
