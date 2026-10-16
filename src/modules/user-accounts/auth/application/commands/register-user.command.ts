import { UserInputDto } from '../../../users/api/input-dto/user.inpu-dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../users/application/commands/create-user.command';
import { generateCode } from '../../../../../core/utils/generate-code';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailService } from '../../../../notification/infrastructure/email.service';

export class RegisterUserCommand {
  constructor(public readonly userInputDto: UserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
    private commandBus: CommandBus,
  ) {}
  async execute(command: RegisterUserCommand): Promise<void> {
    const newUserId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(command.userInputDto),
    );

    const registeredUser =
      await this.usersRepository.findUserByIdOrNotFoundFail(newUserId);

    const code = generateCode();

    registeredUser.setConfirmationInfo(code);
    await this.usersRepository.save(registeredUser);

    await this.emailService
      .sendConfirmationEmail(registeredUser.email, code)
      .catch((err) => {
        console.log(err);
      });
  }
}
