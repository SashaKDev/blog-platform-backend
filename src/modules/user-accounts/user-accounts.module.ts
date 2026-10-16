import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import UsersQueryRepository from './users/infrastructure/users.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user.entity';
import { BasicStrategy } from './auth/guards/basic/basic.strategy';
import { BcryptService } from './auth/application/crypto.service';
import { AuthController } from './auth/api/auth.controller';
import { NotificationsModule } from '../notification/notification.module';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './auth/guards/local/local.strategy';
import { AccessTokenStrategy } from './auth/guards/access-token/access-token.strategy';
import { DeleteUserHandler } from './users/application/handlers/delete-user.handler';
import { GetUserByIdHandler } from './users/application/handlers/get-user-by-id.handler';
import { GetUsersHandler } from './users/application/handlers/get-users-handler';
import { LoginUserHandler } from './auth/application/commands/login-user.command';
import { RegisterUserHandler } from './auth/application/commands/register-user.command';
import { ConfirmRegisterHandler } from './auth/application/commands/confirm-register.command';
import { ResendRegisterEmailHandler } from './auth/application/commands/resend-register-email.command';
import { SendPasswordRecoveryEmailHandler } from './auth/application/commands/send-password-recovery-email.command';
import { GetMyProfileHandler } from './auth/application/query/get-my-profile.query';
import { ValidateUserHandler } from './auth/application/commands/validate-user.command';
import { PassportModule } from '@nestjs/passport';
import { CoreConfig } from '../config/core.config';
import { Session, SessionSchema } from './sessions/domain/session.entity';
import { SessionsRepository } from './sessions/infrastructure/sessions.repository';
import { RefreshTokenStrategy } from './auth/guards/refresh-token/refresh-token.strategy';
import { GenerateNewTokensHandler } from './auth/application/commands/generate-new-tokens-command';
import { LogoutHandler } from './auth/application/commands/logout.command';
import { SessionsQueryRepository } from './sessions/infrastructure/sessions.query-repository';
import { GetDevicesHandler } from './security-devices/application/queries/get-devices.query';
import { SecurityDevicesController } from './security-devices/api/security-devices.controller';
import { TerminateDeviceHandler } from './security-devices/application/commands/terminate-device.command';
import {
  TerminateAllOtherDevicesHandler
} from './security-devices/application/commands/terminate-all-other-devices.command';
import { CreateUserHandler } from './users/application/commands/create-user.command';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    NotificationsModule,
    PassportModule,
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    {
      provide: 'ACCESS_TOKEN_STRATEGY_INJECT_TOKEN',
      useFactory: (coreConfig: CoreConfig): JwtService => {
        return new JwtService({
          secret: coreConfig.accessTokenSecret,
          signOptions: { expiresIn: coreConfig.accessTokenExpiringTime },
        });
      },
      inject: [CoreConfig],
    },
    {
      provide: 'REFRESH_TOKEN_STRATEGY_INJECT_TOKEN',
      useFactory: (coreConfig: CoreConfig): JwtService => {
        return new JwtService({
          secret: coreConfig.refreshTokenSecret,
          signOptions: { expiresIn: coreConfig.refreshTokenExpiringTime },
        });
      },
      inject: [CoreConfig],
    },
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BcryptService,
    BasicStrategy,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    SessionsRepository,
    SessionsQueryRepository,
    DeleteUserHandler,
    CreateUserHandler,
    GetUserByIdHandler,
    GetUsersHandler,
    LoginUserHandler,
    RegisterUserHandler,
    ConfirmRegisterHandler,
    ResendRegisterEmailHandler,
    SendPasswordRecoveryEmailHandler,
    GetMyProfileHandler,
    ValidateUserHandler,
    GenerateNewTokensHandler,
    LogoutHandler,
    GetDevicesHandler,
    TerminateDeviceHandler,
    TerminateAllOtherDevicesHandler,
  ],
})
export class UserAccountsModule {}
