import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getHello(): string {
    console.log(process.env.NODE_ENV);
    return 'Hello World!';
  }

  @Get('testing/all-data')
  async deleteAllData() {}
}
