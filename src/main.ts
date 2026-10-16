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
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    console.log(`🔍 Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`🍪 Cookies:`, JSON.stringify(req.cookies, null, 2));
    next();
  });
  await app.listen(coreConfig.port);
}
bootstrap();
