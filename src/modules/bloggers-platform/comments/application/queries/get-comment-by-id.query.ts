import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentLikesQueryRepository } from '../../../likes/comments-likes/infrastructure/comment-likes.query-repository';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';

export class GetCommentByIdQuery {
  constructor(
    public readonly commentId: string,
    public readonly user: UserPayloadDto,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentLikesQueryRepository: CommentLikesQueryRepository,
  ) {}

  async execute(query: GetCommentByIdQuery): Promise<CommentViewDto> {
    const foundComment =
      await this.commentsQueryRepository.findByIdOrNotFoundFail(
        query.commentId,
      );

    const allLikesAndDislikes =
      await this.commentLikesQueryRepository.getLikesAndDislikesByCommentId(
        query.commentId,
      );

    return CommentViewDto.mapToView(
      foundComment,
      allLikesAndDislikes,
      query.user,
    );
  }
}
