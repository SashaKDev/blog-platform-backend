import { InjectModel } from '@nestjs/mongoose';
import { Blog, type BlogModelType } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../commands/create-blog.command';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: CreateBlogCommand): Promise<string> {
    const blogDto = command.blogDto;
    const blog = this.BlogModel.createInstance(blogDto);
    await this.blogsRepository.save(blog);
    return blog._id.toString();
  }
}
