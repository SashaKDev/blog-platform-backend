import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBlogCommand } from '../commands/delete-blog.command';

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(command: DeleteBlogCommand): Promise<void> {
    const foundBlog = await this.blogsRepository.findByIdOrNotFoundFail(
      command.id,
    );

    foundBlog.makeDeleted();

    await this.blogsRepository.save(foundBlog);
  }
}
