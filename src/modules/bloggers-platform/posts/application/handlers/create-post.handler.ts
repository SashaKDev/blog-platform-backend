import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../../domain/post.entity';
import { CommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/create-post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}
  async execute(command: CreatePostCommand): Promise<PostViewDto> {
    const blog = await this.blogsRepository.findByIdOrNotFoundFail(
      command.postDto.blogId,
    );

    const newPost = this.PostModel.createInstance(command.postDto, blog.name);
    await this.postsRepository.save(newPost);

    return PostViewDto.mapToView(newPost, []);
  }
}
