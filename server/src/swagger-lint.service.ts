import { readFileSync } from 'fs';

// import validator from 'ibm-openapi-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SwaggerLintService {
  static async runLint(swaggerPath: string): Promise<any> {
    const doc = JSON.parse(readFileSync(swaggerPath, 'utf8'));
    try {
      // const result = await validator(doc, true);
      const result = {};
      return result;
    } catch (err) {
      return { errors: [ { message: 'Validation failed to run', error: err } ] };
    }
  }
}
