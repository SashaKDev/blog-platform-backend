import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputDto } from '../../api/input-dto/comment-input.dto';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../../domain/comment.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';

export class UpdateCommentCommand extends Command<void> {
  constructor(
    public readonly commentId: string,
    public readonly body: CommentInputDto,
    public readonly user: UserPayloadDto,
  ) {
    super();
  }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const foundComment: CommentDocument =
      await this.commentsRepository.findByIdOrNotFoundFail(command.commentId);

    if (foundComment.userId !== command.user.userId) {
      throw new DomainException({
        message: 'forbidden',
        code: DomainExceptionCodes.Forbidden,
      });
    }

    foundComment.content = command.body.content;
    return this.commentsRepository.save(foundComment);
  }
}
