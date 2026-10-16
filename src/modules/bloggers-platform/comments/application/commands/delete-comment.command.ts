import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { ForbiddenException } from '@nestjs/common';

export class DeleteCommentCommand extends Command<void> {
  constructor(
    public readonly commentId: string,
    public readonly user: UserPayloadDto,
  ) {
    super();
  }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}
  async execute(command: DeleteCommentCommand) {
    const foundComment = await this.commentsRepository.findByIdOrNotFoundFail(
      command.commentId,
    );

    if (foundComment.userId !== command.user.userId) {
      throw new ForbiddenException();
    }

    foundComment.makeDeleted();

    return this.commentsRepository.save(foundComment);
  }
}
