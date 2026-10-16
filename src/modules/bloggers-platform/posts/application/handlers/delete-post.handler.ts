import { PostsRepository } from '../../infrastructure/posts.repository';
import { DeletePostCommand } from '../commands/delete-post.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: DeletePostCommand): Promise<void> {
    const foundPost = await this.postsRepository.findByIdOrNotFoundFail(
      command.id,
    );

    foundPost.makeDeleted();

    await this.postsRepository.save(foundPost);
  }
}
