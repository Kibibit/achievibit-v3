import { Injectable } from '@nestjs/common';

import { SmeeService } from '@kb-config';

@Injectable()
export class AppService {
  constructor(
    // smeeService: SmeeService
  ) {
    // smeeService.initializeSmeeClient();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
