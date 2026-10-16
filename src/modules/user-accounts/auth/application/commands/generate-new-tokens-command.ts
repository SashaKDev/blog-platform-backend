import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenPairDto } from '../dto/token-pair.dto';
import { RefreshTokenPayload } from '../../guards/refresh-token/dto/refresh-token-payload';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class GenerateNewTokensCommand extends Command<TokenPairDto> {
  constructor(public readonly refreshTokenPayload: RefreshTokenPayload) {
    super();
  }
}

@CommandHandler(GenerateNewTokensCommand)
export class GenerateNewTokensHandler implements ICommandHandler<GenerateNewTokensCommand> {
  constructor(
    private sessionsRepository: SessionsRepository,
    @Inject('ACCESS_TOKEN_STRATEGY_INJECT_TOKEN')
    private accessTokenContext: JwtService,
    @Inject('REFRESH_TOKEN_STRATEGY_INJECT_TOKEN')
    private refreshTokenContext: JwtService,
  ) {}

  async execute(command: GenerateNewTokensCommand): Promise<TokenPairDto> {
    const deviceId = command.refreshTokenPayload.deviceId;
    const userId = command.refreshTokenPayload.userId;
    const iat = command.refreshTokenPayload.iat;

    const session =
      await this.sessionsRepository.findSessionByDeviceId(deviceId);

    if (!session) {
      throw new UnauthorizedException('Session does not exist');
    }

    if (session.iat !== iat) {
      throw new UnauthorizedException('Bad refresh token');
    }

    const newAccessToken = await this.accessTokenContext.signAsync({
      userId: userId,
    });

    const newRefreshToken = await this.refreshTokenContext.signAsync({
      userId: userId,
      deviceId: deviceId,
    });

    const refreshTokenPayload = this.refreshTokenContext.decode<{
      iat: number;
    }>(newRefreshToken);

    session.updateIat(refreshTokenPayload.iat);
    await this.sessionsRepository.save(session);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
