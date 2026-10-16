import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import { CoreConfig } from './modules/config/core.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  app.use(cookieParser());
  await app.listen(coreConfig.port);
}
bootstrap();
