import { Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentViewDto } from './view-dto/comment.view-dto';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsRepository: CommentsRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get('/:commentId')
  async getComment(
    @Param('commentId') commentId: string,
  ): Promise<CommentViewDto> {
    return this.commentsQueryRepository.findByIdOrNotFoundFail(commentId);
  }

  @Post()
  async testCreateComment() {
    return this.commentsRepository.testCreateComment();
  }
}
