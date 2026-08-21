import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/start-test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `
        <html>
          <body>
              <h1>Все работает броу</h1>
              
          </body>
        </html>
    `;
  }

  @Get('testing/all-data')
  async deleteAllData(){

  }
}
