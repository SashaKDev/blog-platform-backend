import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentViewDto } from './view-dto/comment.view-dto';
import { GetCommentByIdQuery } from '../application/queries/get-comment-by-id.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../application/commands/delete-comment.command';
import { ExtractUserFromRequest } from '../../../user-accounts/auth/guards/decorators/extract-user-from-request.decorator';
import { UserPayloadDto } from '../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { AccessTokenGuard } from '../../../user-accounts/auth/guards/access-token/access-token.guard';
import { UpdateCommentCommand } from '../application/commands/update-comment.command';
import { LikeStatusInputDto } from '../../likes/posts-likes/domain/input-dto/like-status.input.dto';
import { UpdateCommentLikeStatusCommand } from '../../likes/comments-likes/application/commands/update-comment-like-status.command';
import { OptionalJwtGuard } from '../../../user-accounts/auth/guards/access-token/optional-jwt.guard';
import { CommentUpdateDto } from './input-dto/comment-update.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}
  @Get('/:commentId')
  @UseGuards(OptionalJwtGuard)
  async getComment(
    @Param('commentId') commentId: string,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<CommentViewDto> {
    return this.queryBus.execute(new GetCommentByIdQuery(commentId, user));
  }

  @Put('/:commentId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() body: CommentUpdateDto,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, body, user),
    );
  }

  @Put('/:commentId/like-status')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentLikeStatus(
    @Param('commentId') commentId: string,
    @Body() body: LikeStatusInputDto,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentLikeStatusCommand(commentId, body, user),
    );
  }

  @Delete('/:commentId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteCommentCommand(commentId, user));
  }
}
