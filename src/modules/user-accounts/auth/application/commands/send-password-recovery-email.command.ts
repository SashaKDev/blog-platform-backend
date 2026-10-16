import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { generateCode } from '../../../../../core/utils/generate-code';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../notification/infrastructure/email.service';

export class SendPasswordRecoveryEmailCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(SendPasswordRecoveryEmailCommand)
export class SendPasswordRecoveryEmailHandler implements ICommandHandler<SendPasswordRecoveryEmailCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: SendPasswordRecoveryEmailCommand): Promise<void> {
    const user = await this.usersRepository.findByEmail(command.email);
    if (!user) {
      throw new DomainException({
        message: 'Incorrect email',
        code: DomainExceptionCodes.NotFound,
        extensions: [{ field: 'email', message: 'user does not exist' }],
      });
    }

    const passwordRecoveryCode = generateCode();
    user.setPasswordRecoveryInfo(passwordRecoveryCode);
    await this.usersRepository.save(user);

    await this.emailService
      .sendPasswordRecoveryEmail(command.email, passwordRecoveryCode)
      .catch((err) => {
        console.log(err);
      });
  }
}
