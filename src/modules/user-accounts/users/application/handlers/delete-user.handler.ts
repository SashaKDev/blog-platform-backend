import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UsersRepository } from '../../infrastructure/users.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}
  async execute(command: DeleteUserCommand): Promise<void> {
    const foundUser = await this.usersRepository.findUserByIdOrNotFoundFail(
      command.userId,
    );

    foundUser.makeDeleted();

    await this.usersRepository.save(foundUser);
  }
}
