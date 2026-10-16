import { UserPayloadDto } from '../../guards/local/dto/user-payload.dto';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { TokenPairDto } from '../dto/token-pair.dto';
import { getDeviceTitle } from '../../../sessions/utils/get-device-name.util';
import { randomUUID } from 'crypto';
import { CreateSessionDto } from '../../../sessions/domain/dto/create-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  type SessionModelType,
} from '../../../sessions/domain/session.entity';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';

export class LoginUserCommand extends Command<TokenPairDto> {
  constructor(
    public readonly userPayloadDto: UserPayloadDto,
    public readonly userAgent: string,
    public readonly ip: string,
  ) {
    super();
  }
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject('ACCESS_TOKEN_STRATEGY_INJECT_TOKEN')
    private accessTokenContext: JwtService,
    @Inject('REFRESH_TOKEN_STRATEGY_INJECT_TOKEN')
    private refreshTokenContext: JwtService,
    @InjectModel(Session.name) private SessionModel: SessionModelType,
    private sessionsRepository: SessionsRepository,
  ) {}

  async execute(command: LoginUserCommand): Promise<TokenPairDto> {
    const accessToken = await this.accessTokenContext.signAsync({
      userId: command.userPayloadDto.userId,
      login: command.userPayloadDto.login,
    });
    const deviceTitle = getDeviceTitle(command.userAgent);
    const deviceId = randomUUID();

    const createSessionDto: CreateSessionDto = {
      userId: command.userPayloadDto.userId,
      deviceId: deviceId,
      deviceTitle: deviceTitle,
      ip: command.ip,
    };

    const newSession = this.SessionModel.createInstance(createSessionDto);

    const refreshToken = await this.refreshTokenContext.signAsync({
      userId: command.userPayloadDto.userId,
      deviceId: newSession.deviceId,
    });

    const refreshTokenPayload = this.refreshTokenContext.decode<{
      iat: number;
    }>(refreshToken);
    newSession.iat = refreshTokenPayload.iat;

    await this.sessionsRepository.save(newSession);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
