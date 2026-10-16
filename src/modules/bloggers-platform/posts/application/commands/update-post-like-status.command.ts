import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikeCreateDto } from '../../../likes/posts-likes/domain/dto/post-like.create.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  type PostLikeModelType,
} from '../../../likes/posts-likes/domain/post-like.entity';
import { PostLikesRepository } from '../../../likes/posts-likes/infrastructure/post-likes.repository';

export class UpdatePostLikeStatusCommand extends Command<void> {
  constructor(public readonly likeDto: PostLikeCreateDto) {
    super();
  }
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusHandler implements ICommandHandler<UpdatePostLikeStatusCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private postLikesRepository: PostLikesRepository,
    @InjectModel(PostLike.name) private PostLikeModel: PostLikeModelType,
  ) {}

  async execute(command: UpdatePostLikeStatusCommand): Promise<void> {
    const foundPost = await this.postsRepository.findByIdOrNotFoundFail(
      command.likeDto.postId,
    );

    const foundLike = await this.postLikesRepository.findLike(
      command.likeDto.postId,
      command.likeDto.userId,
    );

    if (foundLike) {
      foundLike.setLikeStatus(command.likeDto.status);
      await this.postLikesRepository.save(foundLike);
      return;
    }

    const newPostLike = this.PostLikeModel.createInstance(command.likeDto);
    return this.postLikesRepository.save(newPostLike);
  }
}
