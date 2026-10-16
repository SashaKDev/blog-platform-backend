import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostInputDto } from './input-dto/post.input-dto';
import { PostUpdateDto } from './input-dto/post.update-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { PostViewDto } from './view-dto/post.view-dto';
import { PostsQueryParams } from './input-dto/posts.query-params.input-dto';
import { CommentsQueryParams } from '../../comments/api/input-dto/comments.query-params.input-dto';
import { CommentViewDto } from '../../comments/api/view-dto/comment.view-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/commands/create-post.command';
import { UpdatePostCommand } from '../application/commands/update-post.command';
import { MongoIdInputDto } from '../../../../core/dto/mongo-id.input-dto';
import { DeletePostCommand } from '../application/commands/delete-post.command';
import { GetAllPostsQuery } from '../application/queries/get-all-posts.query';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query';
import { GetCommentsForPostQuery } from '../../comments/application/queries/get-comments-for-post.query';
import { AccessTokenGuard } from '../../../user-accounts/auth/guards/access-token/access-token.guard';
import { ExtractUserFromRequest } from '../../../user-accounts/auth/guards/decorators/extract-user-from-request.decorator';
import { UserPayloadDto } from '../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { PostLikeCreateDto } from '../../likes/posts-likes/domain/dto/post-like.create.dto';
import { LikeStatusInputDto } from '../../likes/posts-likes/domain/input-dto/like-status.input.dto';
import { UpdatePostLikeStatusCommand } from '../application/commands/update-post-like-status.command';
import { OptionalJwtGuard } from '../../../user-accounts/auth/guards/access-token/optional-jwt.guard';
import { CommentInputDto } from '../../comments/api/input-dto/comment-input.dto';
import { CreateCommentCommand } from '../../comments/application/commands/create-comment.command';
import { BasicGuard } from '../../../../core/guards/basic.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  async getAllPosts(
    @Query() postsQueryParams: PostsQueryParams,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    return this.queryBus.execute(new GetAllPostsQuery(postsQueryParams, user));
  }

  @Get(':postId')
  @UseGuards(OptionalJwtGuard)
  async getPost(
    @Param('postId') postId: string,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<PostViewDto> {
    return this.queryBus.execute(new GetPostByIdQuery(postId, user));
  }

  @Get('/:postId/comments')
  @UseGuards(OptionalJwtGuard)
  async getCommentsForPost(
    @Param('postId') postId: string,
    @Query() query: CommentsQueryParams,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<BasePaginatedViewDto<CommentViewDto[]>> {
    return this.queryBus.execute(
      new GetCommentsForPostQuery(postId, query, user),
    );
  }

  @Post()
  @UseGuards(BasicGuard)
  async createPost(@Body() body: PostInputDto): Promise<PostViewDto> {
    return this.commandBus.execute(new CreatePostCommand(body));
  }

  @Post(':postId/comments')
  @UseGuards(AccessTokenGuard)
  async createComment(
    @Param('postId') postId: string,
    @Body() body: CommentInputDto,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(postId, body, user),
    );
  }

  @Put(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param() params: MongoIdInputDto,
    @Body() body: PostUpdateDto,
  ) {
    console.log(body);
    return this.commandBus.execute<UpdatePostCommand, PostUpdateDto>(
      new UpdatePostCommand(params.id, body),
    );
  }

  @Put(':postId/like-status')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async putPostLikeStatus(
    @Param('postId') postId: string,
    @Body() body: LikeStatusInputDto,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<void> {
    const likeDto: PostLikeCreateDto = {
      postId: postId,
      userId: user.userId,
      userLogin: user.login,
      status: body.likeStatus,
    };
    return this.commandBus.execute(new UpdatePostLikeStatusCommand(likeDto));
  }
  @Delete(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }
}
