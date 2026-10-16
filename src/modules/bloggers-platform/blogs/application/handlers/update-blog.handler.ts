import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdateBlogCommand } from '../commands/update-blog.command';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(command: UpdateBlogCommand): Promise<void> {
    const foundBlog = await this.blogsRepository.findByIdOrNotFoundFail(
      command.id,
    );

    foundBlog.update(command.blogUpdateDto);

    await this.blogsRepository.save(foundBlog);
  }
}
