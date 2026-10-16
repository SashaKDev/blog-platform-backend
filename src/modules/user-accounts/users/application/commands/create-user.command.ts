import { UserInputDto } from '../../api/input-dto/user.inpu-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { BcryptService } from '../../../auth/application/crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../../domain/user.entity';

export class CreateUserCommand {
  constructor(public readonly userDto: UserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}
  async execute(command: CreateUserCommand): Promise<string> {
    const userWithSameLogin = await this.usersRepository.findByLogin(
      command.userDto.login,
    );

    if (userWithSameLogin) {
      throw new DomainException({
        message: 'Creation failed',
        code: DomainExceptionCodes.BadRequest,
        extensions: [{ field: 'login', message: 'login already exists' }],
      });
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(
      command.userDto.email,
    );

    if (userWithSameEmail) {
      throw new DomainException({
        message: 'Creation failed',
        code: DomainExceptionCodes.BadRequest,
        extensions: [{ field: 'email', message: 'email already exists' }],
      });
    }

    const passwordHash = await this.bcryptService.hashPassword(
      command.userDto.password,
    );

    const newUser = this.UserModel.createInstance({
      ...command.userDto,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(newUser);

    return newUser._id.toString();
  }
}
