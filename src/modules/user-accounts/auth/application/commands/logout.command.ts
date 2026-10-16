import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenPayload } from '../../guards/refresh-token/dto/refresh-token-payload';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';
import { UnauthorizedException } from '@nestjs/common';

export class LogoutCommand extends Command<void> {
  constructor(public readonly payload: RefreshTokenPayload) {
    super();
  }
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: LogoutCommand): Promise<void> {
    const deviceId = command.payload.deviceId;
    const userId = command.payload.userId;
    const iat = command.payload.iat;

    const session =
      await this.sessionsRepository.findSessionByDeviceId(deviceId);

    if (!session) {
      throw new UnauthorizedException('Session does not exist');
    }

    if (session.iat !== iat) {
      throw new UnauthorizedException('Refresh token expired');
    }

    session.makeDeleted();

    return this.sessionsRepository.save(session);
  }
}
