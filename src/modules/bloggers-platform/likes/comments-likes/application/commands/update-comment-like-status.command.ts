import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatusInputDto } from '../../../posts-likes/domain/input-dto/like-status.input.dto';
import { UserPayloadDto } from '../../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository } from '../../../../comments/infrastructure/comments.repository';
import {
  CommentLike,
  type CommentLikeModelType,
} from '../../domain/comment-like.entity';
import { CommentLikesRepository } from '../../infrastructure/comment-likes.repository';
import { CommentLikeCreateDto } from '../../domain/dto/comment-like.create.dto';

export class UpdateCommentLikeStatusCommand extends Command<void> {
  constructor(
    public readonly commentId: string,
    public readonly body: LikeStatusInputDto,
    public readonly user: UserPayloadDto,
  ) {
    super();
  }
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusHandler implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private commentsRepository: CommentsRepository,
    private commentLikesRepository: CommentLikesRepository,
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  async execute(command: UpdateCommentLikeStatusCommand): Promise<void> {
    const foundComment = await this.commentsRepository.findByIdOrNotFoundFail(
      command.commentId,
    );

    const foundLike = await this.commentLikesRepository.findLike(
      command.commentId,
      command.user.userId,
    );

    if (foundLike) {
      foundLike.setLikeStatus(command.body.likeStatus);
      await this.commentLikesRepository.save(foundLike);
      return;
    }

    const likeDto: CommentLikeCreateDto = {
      commentId: command.commentId,
      userId: command.user.userId,
      userLogin: command.user.login,
      status: command.body.likeStatus,
    };

    const newCommentLike = this.CommentLikeModel.createInstance(likeDto);
    return this.commentLikesRepository.save(newCommentLike);
  }
}
