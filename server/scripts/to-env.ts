import { parse } from 'dotenv';
import { readJsonSync, writeFileSync } from 'fs-extra';
import { omit } from 'lodash';

class EnvService {
  fromJson(object: Record<string, unknown>) {
    let envFile = '';
    for (const key of Object.keys(object)) {
      envFile += `${ key }="${ object[key] }"\n`;
    }
    return envFile;
  }

  toJson(envFile: string) {
    return parse(envFile);
  }
}

(async () => {
  const envService = new EnvService();

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const jsonEnv = readJsonSync(`./.env.${ NODE_ENV }.achievibit.json`);
  const envFile = envService.fromJson(omit(jsonEnv, '$schema'));

  writeFileSync('./../.env', envFile);
})();

