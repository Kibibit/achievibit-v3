import { Injectable } from '@nestjs/common';


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
