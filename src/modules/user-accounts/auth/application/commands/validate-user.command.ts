import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPayloadDto } from '../../guards/local/dto/user-payload.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BcryptService } from '../crypto.service';

export class ValidateUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler implements ICommandHandler<ValidateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async execute(command: ValidateUserCommand): Promise<UserPayloadDto | null> {
    const userByLogin = await this.usersRepository.findByLogin(
      command.username,
    );
    const userByEmail = await this.usersRepository.findByEmail(
      command.username,
    );

    const user = userByLogin ? userByLogin : userByEmail;

    if (!user) {
      return null;
    }

    const passwordCompareResult = await this.bcryptService.comparePasswords(
      command.password,
      user.passwordHash,
    );

    if (!passwordCompareResult) {
      return null;
    }

    const payload = { userId: user.id, login: user.login };
    return payload;
  }
}
