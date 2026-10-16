import { PostsQueryParams } from '../../api/input-dto/posts.query-params.input-dto';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { BasePaginatedViewDto } from '../../../../../core/dto/base.paginated-view.dto';
import { PostDocument } from '../../domain/post.entity';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { PostLikeDocument } from '../../../likes/posts-likes/domain/post-like.entity';
import { PostLikesQueryRepository } from '../../../likes/posts-likes/infrastructure/post-likes.query-repository';

export class GetAllPostsQuery {
  constructor(
    public readonly postsQueryParams: PostsQueryParams,
    public readonly user?: UserPayloadDto,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postLikesQueryRepository: PostLikesQueryRepository,
  ) {}
  async execute(
    query: GetAllPostsQuery,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    const { postsQueryParams, user } = query;

    const allPosts: PostDocument[] =
      await this.postsQueryRepository.getAllPosts(postsQueryParams);

    const postIds: string[] = allPosts.map((post) => post._id.toString());

    const allLikes: PostLikeDocument[] =
      await this.postLikesQueryRepository.getLikesAndDislikesByPostIds(postIds);

    const likesByPostId = new Map<string, PostLikeDocument[]>();
    for (const like of allLikes) {
      const postId = like.postId.toString();
      const list = likesByPostId.get(postId) ?? [];
      list.push(like);
      likesByPostId.set(postId, list);
    }

    const items = allPosts.map((post) => {
      const postLikes = likesByPostId.get(post._id.toString());
      return PostViewDto.mapToView(post, postLikes, user);
    });

    const totalCount = await this.postsQueryRepository.countAllPosts();

    return BasePaginatedViewDto.mapToView({
      items: items,
      totalCount: totalCount,
      pageNumber: postsQueryParams.pageNumber,
      pageSize: postsQueryParams.pageSize,
    });
  }
}
