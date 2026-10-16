// import { Injectable } from '@nestjs/common';
// import { CommentsQueryParams } from '../api/input-dto/comments.query-params.input-dto';
// import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
// import { CommentViewDto } from '../api/view-dto/comment.view-dto';
// import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
// import { GetPostByIdHandler } from '../../posts/application/handlers/get-post.handler';
//
// @Injectable()
// export class CommentsService {
//   constructor(
//     private commentsQueryRepository: CommentsQueryRepository,
//     private getPostUseCase: GetPostByIdHandler,
//   ) {}

  // async getCommentsForPost(
  //   postId: string,
  //   queries: CommentsQueryParams,
  // ): Promise<BasePaginatedViewDto<CommentViewDto[]>> {
  //   const post = await this.getPostUseCase.execute(postId);
  //
  //   return this.commentsQueryRepository.getCommentsForPost(postId, queries);
  // }
// }
