import { Injectable } from '@nestjs/common';
import { CommentsQueryParams } from '../api/input-dto/comments.query-params.input-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { CommentViewDto } from '../api/view-dto/comment.view-dto';
import { PostsService } from '../../posts/application/posts.service';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private postsService: PostsService,
  ) {}

  async getCommentsForPost(
    postId: string,
    query: CommentsQueryParams,
  ): Promise<BasePaginatedViewDto<CommentViewDto[]>> {
    const post = await this.postsService.getPostById(postId);

    return this.commentsQueryRepository.getCommentsForPost(postId, query);
  }
}
