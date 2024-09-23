import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SmeeService } from '@kb-config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly smeeService: SmeeService
  ) {
    this.smeeService.initializeSmeeClient();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
