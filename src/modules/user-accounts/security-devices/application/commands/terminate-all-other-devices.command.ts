import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions.repository';
import { RefreshTokenPayload } from '../../../auth/guards/refresh-token/dto/refresh-token-payload';

export class TerminateAllOtherDevicesCommand extends Command<void> {
  constructor(public readonly payload: RefreshTokenPayload) {
    super();
  }
}

@CommandHandler(TerminateAllOtherDevicesCommand)
export class TerminateAllOtherDevicesHandler implements ICommandHandler<TerminateAllOtherDevicesCommand> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: TerminateAllOtherDevicesCommand): Promise<void> {
    return this.sessionsRepository.terminateAllOtherDevices(
      command.payload.deviceId,
      command.payload.userId,
    );
  }
}
