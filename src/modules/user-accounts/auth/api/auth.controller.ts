import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserInputDto } from '../../users/api/input-dto/user.inpu-dto';
import { EmailInputDto } from '../../../../core/dto/email.input-dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LocalAuthGuard } from '../guards/local/local.guard';
import { UserPayloadDto } from '../guards/local/dto/user-payload.dto';
import type { Response } from 'express';
import { MyProfileViewDto } from './view-dto/my-profile.view-dto';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { LoginUserCommand } from '../application/commands/login-user.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/commands/register-user.command';
import { ConfirmRegisterCommand } from '../application/commands/confirm-register.command';
import { ResendRegisterEmailCommand } from '../application/commands/resend-register-email.command';
import { SendPasswordRecoveryEmailCommand } from '../application/commands/send-password-recovery-email.command';
import { ChangePasswordCommand } from '../application/commands/change-password.command';
import { GetMyProfileQuery } from '../application/query/get-my-profile.query';
import { ExtractIpFromRequest } from '../guards/decorators/extract-ip-from-request';
import { ExtractUserAgentFromRequest } from '../guards/decorators/extract-user-agent-from-request';
import { RefreshTokenGuard } from '../guards/refresh-token/refresh-token.guard';
import { ExtractRefreshTokenPayloadFromRequest } from '../guards/decorators/extract-refresh-token-payload-from-request';
import { RefreshTokenPayload } from '../guards/refresh-token/dto/refresh-token-payload';
import { TokenPairDto } from '../application/dto/token-pair.dto';
import { GenerateNewTokensCommand } from '../application/commands/generate-new-tokens-command';
import { AccessTokenGuard } from '../guards/access-token/access-token.guard';
import { LogoutCommand } from '../application/commands/logout.command';
import { CoreConfig } from '../../../config/core.config';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private coreConfig: CoreConfig,
  ) {}

  @Post('/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() userInputDto: UserInputDto): Promise<void> {
    await this.commandBus.execute(new RegisterUserCommand(userInputDto));
  }

  @Post('/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegister(@Body() body: { code: string }): Promise<void> {
    await this.commandBus.execute(new ConfirmRegisterCommand(body));
  }

  @Post('/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendRegisterEmail(@Body() body: EmailInputDto): Promise<void> {
    await this.commandBus.execute(new ResendRegisterEmailCommand(body.email));
  }

  @Post('/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendPasswordRecoveryEmail(@Body() body: EmailInputDto): Promise<void> {
    await this.commandBus.execute(
      new SendPasswordRecoveryEmailCommand(body.email),
    );
  }

  @Post('/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Body() body: { newPassword: string; recoveryCode: string },
  ): Promise<void> {
    await this.commandBus.execute(
      new ChangePasswordCommand(body.newPassword, body.recoveryCode),
    );
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserPayloadDto,
    @ExtractIpFromRequest() ip: string,
    @ExtractUserAgentFromRequest() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const tokenPair = await this.commandBus.execute(
      new LoginUserCommand(user, userAgent, ip),
    );

    res.cookie('refreshToken', tokenPair.refreshToken, {
      httpOnly: true, // ← JS не может прочитать
      secure: true, // ← только HTTPS в проде
      maxAge: 7 * 24 * 60 * 60 * 1000, // ← 7 дней в миллисекундах
    });

    return { accessToken: tokenPair.accessToken };
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async generateNewTokens(
    @ExtractRefreshTokenPayloadFromRequest() payload: RefreshTokenPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const newTokenPair: TokenPairDto = await this.commandBus.execute(
      new GenerateNewTokensCommand(payload),
    );

    res.cookie('refreshToken', newTokenPair.refreshToken, {
      httpOnly: true, // ← JS не может прочитать
      secure: true, // ← только HTTPS в проде
      maxAge: 7 * 24 * 60 * 60 * 1000, // ← 7 дней в миллисекундах
    });

    return { accessToken: newTokenPair.accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @ExtractRefreshTokenPayloadFromRequest() payload: RefreshTokenPayload,
  ): Promise<void> {
    return await this.commandBus.execute(new LogoutCommand(payload));
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async me(
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<MyProfileViewDto> {
    return this.queryBus.execute(new GetMyProfileQuery(user.userId));
  }
}
