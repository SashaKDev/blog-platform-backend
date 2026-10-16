import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { PostLikesQueryRepository } from '../../../likes/posts-likes/infrastructure/post-likes.query-repository';
import { PostLikeDocument } from '../../../likes/posts-likes/domain/post-like.entity';

export class GetPostByIdQuery {
  constructor(
    public readonly postId: string,
    public readonly user?: UserPayloadDto,
  ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postLikesQueryRepository: PostLikesQueryRepository,
  ) {}
  async execute(query: GetPostByIdQuery): Promise<PostViewDto> {
    const { postId, user } = query;

    const post =
      await this.postsQueryRepository.getPostByIdOrNotFoundFail(postId);

    const likesAndDislikes: PostLikeDocument[] =
      await this.postLikesQueryRepository.getLikesAndDislikesByPostId(post.id);

    return PostViewDto.mapToView(post, likesAndDislikes, user);
  }
}
