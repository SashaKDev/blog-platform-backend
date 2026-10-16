import { configModule } from './modules/config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from './modules/config/core.module';
import { CoreConfig } from './modules/config/core.config';

@Module({
  imports: [
    configModule,
    CoreModule,
    CqrsModule.forRoot(),
    UserAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          uri: coreConfig.mongoUri,
        };
      },
      inject: [CoreConfig],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000, // 10 секунд (в миллисекундах!)
          limit: 5, // 5 запросов за ttl
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
