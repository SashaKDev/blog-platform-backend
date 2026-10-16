import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputDto } from '../../api/input-dto/comment-input.dto';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../../domain/comment.entity';
import { CreateCommentDto } from '../../domain/dto/create-comment.dto';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentCommand extends Command<CommentViewDto> {
  constructor(
    public readonly postId: string,
    public readonly body: CommentInputDto,
    public readonly user: UserPayloadDto,
  ) {
    super();
  }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
  ) {}
  async execute(command: CreateCommentCommand): Promise<CommentViewDto> {
    const { postId, user } = command;
    const content = command.body.content;

    const foundPost = await this.postsRepository.findByIdOrNotFoundFail(postId);

    const dto: CreateCommentDto = {
      content: content,
      postId: postId,
      userId: user.userId,
      userLogin: user.login,
    };

    const newComment = this.CommentModel.createInstance(dto);
    await this.commentsRepository.save(newComment);

    return CommentViewDto.mapToView(newComment);
  }
}
