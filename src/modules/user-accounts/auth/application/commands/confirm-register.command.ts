import { CodeObject } from '../../../../../core/dto/code-object';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class ConfirmRegisterCommand {
  constructor(public readonly body: CodeObject) {}
}

@CommandHandler(ConfirmRegisterCommand)
export class ConfirmRegisterHandler implements ICommandHandler<ConfirmRegisterCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmRegisterCommand): Promise<void> {
    const user = await this.usersRepository.findUserByConfirmationCode(
      command.body.code,
    );

    if (!user) {
      throw new DomainException({
        message: 'Email confirmation failed',
        code: DomainExceptionCodes.BadRequest,
        extensions: [
          { field: 'code', message: 'incorrect email confirmation code' },
        ],
      });
    }
    if (user.isEmailConfirmed) {
      throw new DomainException({
        message: 'Email confirmation failed',
        code: DomainExceptionCodes.BadRequest,
        extensions: [{ field: 'code', message: 'email already confirmed' }],
      });
    }

    if (user.emailConfirmationInfo.isApplied) {
      throw new DomainException({
        message: 'Email confirmation failed',
        code: DomainExceptionCodes.BadRequest,
        extensions: [
          { field: 'code', message: 'confirmation code already applied' },
        ],
      });
    }

    user.resetConfirmationInfo();
    user.makeEmailConfirmed();
    await this.usersRepository.save(user);
  }
}
