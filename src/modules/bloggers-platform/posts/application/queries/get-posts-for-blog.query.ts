import { PostsQueryParams } from '../../api/input-dto/posts.query-params.input-dto';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BasePaginatedViewDto } from '../../../../../core/dto/base.paginated-view.dto';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { PostLikeDocument } from '../../../likes/posts-likes/domain/post-like.entity';
import { PostLikesQueryRepository } from '../../../likes/posts-likes/infrastructure/post-likes.query-repository';

export class GetPostsForBlogQuery {
  constructor(
    public readonly blogId: string,
    public readonly postsQueryParams: PostsQueryParams,
    public readonly user: UserPayloadDto,
  ) {}
}

@QueryHandler(GetPostsForBlogQuery)
export class GetPostsForBlogHandler implements IQueryHandler<GetPostsForBlogQuery> {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postLikesQueryRepository: PostLikesQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(
    query: GetPostsForBlogQuery,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    const blog = await this.blogsRepository.findByIdOrNotFoundFail(
      query.blogId,
    );
    const allPosts = await this.postsQueryRepository.getPostsForBlog(
      query.blogId,
      query.postsQueryParams,
    );

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
      return PostViewDto.mapToView(post, postLikes, query.user);
    });

    const totalCount = await this.postsQueryRepository.countPostsForBlog(query.blogId);

    return BasePaginatedViewDto.mapToView({
      items: items,
      totalCount: totalCount,
      pageNumber: query.postsQueryParams.pageNumber,
      pageSize: query.postsQueryParams.pageSize,
    });
  }
}
