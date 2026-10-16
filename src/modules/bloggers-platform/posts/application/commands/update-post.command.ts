import { PostUpdateDto } from '../../api/input-dto/post.update-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommandHandler } from '@nestjs/cqrs';

export class UpdatePostCommand {
  constructor(
    public readonly id: string,
    public readonly postUpdateDto: PostUpdateDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler {
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: UpdatePostCommand): Promise<void> {
    const post = await this.postsRepository.findByIdOrNotFoundFail(command.id);
    post.update(command.postUpdateDto);
    await this.postsRepository.save(post);
  }
}
