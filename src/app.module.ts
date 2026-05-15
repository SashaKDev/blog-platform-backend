import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/userAccounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserAccountsModule,
    BloggersPlatformModule,
    MongooseModule.forRoot('mongodb://localhost/testDB'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
