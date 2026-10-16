import { CommentsQueryParams } from '../../api/input-dto/comments.query-params.input-dto';
import { BasePaginatedViewDto } from '../../../../../core/dto/base.paginated-view.dto';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { CommentLikeDocument } from '../../../likes/comments-likes/domain/comment-like.entity';
import { CommentLikesQueryRepository } from '../../../likes/comments-likes/infrastructure/comment-likes.query-repository';

export class GetCommentsForPostQuery {
  constructor(
    public readonly postId: string,
    public readonly commentsQueryParams: CommentsQueryParams,
    public readonly user: UserPayloadDto,
  ) {}
}

@QueryHandler(GetCommentsForPostQuery)
export class GetCommentsForPostHandler implements IQueryHandler<GetCommentsForPostQuery> {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentLikesQueryRepository: CommentLikesQueryRepository,
    private postsRepository: PostsRepository,
  ) {}
  async execute(
    query: GetCommentsForPostQuery,
  ): Promise<BasePaginatedViewDto<CommentViewDto[]>> {
    console.log(query.commentsQueryParams);
    const post = await this.postsRepository.findByIdOrNotFoundFail(
      query.postId,
    );

    const allComments = await this.commentsQueryRepository.getCommentsForPost(
      query.postId,
      query.commentsQueryParams,
    );

    const commentsIds = allComments.map((comment) => comment._id.toString());

    const allLikes: CommentLikeDocument[] =
      await this.commentLikesQueryRepository.getLikesAndDislikesByCommentsIds(
        commentsIds,
      );

    const likesByCommentId = new Map<string, CommentLikeDocument[]>();
    for (const like of allLikes) {
      const commentId = like.commentId.toString();
      const list = likesByCommentId.get(commentId) ?? [];
      list.push(like);
      likesByCommentId.set(commentId, list);
    }

    const items = allComments.map((comment) => {
      const commentLikes = likesByCommentId.get(comment._id.toString());
      return CommentViewDto.mapToView(comment, commentLikes, query.user);
    });

    const totalCount = await this.commentsQueryRepository.countDocuments(
      query.postId,
    );

    return BasePaginatedViewDto.mapToView({
      items: items,
      totalCount: totalCount,
      pageNumber: query.commentsQueryParams.pageNumber,
      pageSize: query.commentsQueryParams.pageSize,
    });
  }
}
