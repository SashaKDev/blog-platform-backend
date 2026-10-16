import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { generateCode } from '../../../../../core/utils/generate-code';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../notification/infrastructure/email.service';

export class ResendRegisterEmailCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendRegisterEmailCommand)
export class ResendRegisterEmailHandler implements ICommandHandler<ResendRegisterEmailCommand> {
  constructor(
    public usersRepository: UsersRepository,
    public emailService: EmailService,
  ) {}

  async execute(command: ResendRegisterEmailCommand): Promise<void> {
    const user = await this.usersRepository.findByEmail(command.email);

    if (!user) {
      throw new DomainException({
        message: 'Incorrect email',
        code: DomainExceptionCodes.BadRequest,
        extensions: [{ field: 'email', message: 'incorrect email' }],
      });
    }

    if (user.isEmailConfirmed) {
      throw new DomainException({
        message: 'Email confirmation failed',
        code: DomainExceptionCodes.BadRequest,
        extensions: [{ field: 'email', message: 'email already confirmed' }],
      });
    }

    const newCode = generateCode();

    user.setConfirmationInfo(newCode);
    await this.usersRepository.save(user);

    await this.emailService
      .sendConfirmationEmail(command.email, newCode)
      .catch((err) => {
        console.log(err);
      });
  }
}