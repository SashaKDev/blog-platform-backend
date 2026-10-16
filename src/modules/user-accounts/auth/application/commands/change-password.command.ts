import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BcryptService } from '../crypto.service';

export class ChangePasswordCommand {
  constructor(
    public readonly newPassword: string,
    public readonly recoveryCode: string,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByPasswordRecoveryCode(
      command.recoveryCode,
    );

    if (!user) {
      throw new DomainException({
        message: 'incorrect recovery code',
        code: DomainExceptionCodes.BadRequest,
      });
    }

    if (user.passwordRecoveryInfo.isApplied) {
      throw new DomainException({
        message: 'code already applied',
        code: DomainExceptionCodes.BadRequest,
      });
    }

    const newHashedPassword = await this.bcryptService.hashPassword(
      command.newPassword,
    );

    user.setPassword(newHashedPassword);
    user.passwordRecoveryInfo.isApplied = true;
    await this.usersRepository.save(user);
  }
}
