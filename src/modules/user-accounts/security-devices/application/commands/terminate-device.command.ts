import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenPayload } from '../../../auth/guards/refresh-token/dto/refresh-token-payload';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';
import { SessionDocument } from '../../../sessions/domain/session.entity';
import { ForbiddenException } from '@nestjs/common';

export class TerminateDeviceCommand extends Command<void> {
  constructor(
    public readonly deviceId: string,
    public readonly payload: RefreshTokenPayload,
  ) {
    super();
  }
}

@CommandHandler(TerminateDeviceCommand)
export class TerminateDeviceHandler implements ICommandHandler<TerminateDeviceCommand> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: TerminateDeviceCommand): Promise<void> {
    const session: SessionDocument =
      await this.sessionsRepository.findSessionByDeviceIdOrNotFoundFail(
        command.deviceId,
      );

    if (session.userId !== command.payload.userId) {
      throw new ForbiddenException('Forbidden!');
    }

    session.makeDeleted();
    await this.sessionsRepository.save(session);
  }
}
