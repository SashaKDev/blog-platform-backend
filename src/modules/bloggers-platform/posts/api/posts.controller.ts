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
} from '@nestjs/common';
import { PostInputDto } from './input-dto/post.input-dto';
import { PostsService } from '../application/posts.service';
import { PostUpdateDto } from './input-dto/post.update-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { PostViewDto } from './view-dto/post.view-dto';
import { PostsQueryParams } from './input-dto/posts.query-params.input-dto';
import { CommentsQueryParams } from '../../comments/api/input-dto/comments.query-params.input-dto';
import { CommentViewDto } from '../../comments/api/view-dto/comment.view-dto';
import { CommentsService } from '../../comments/application/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: PostsQueryParams,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    return this.postsService.getAllPosts(query);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string): Promise<PostViewDto> {
    return this.postsService.getPostById(postId);
  }

  @Get('/:postId/comments')
  async getCommentsForPost(
    @Param('postId') postId: string,
    @Query() query: CommentsQueryParams,
  ): Promise<BasePaginatedViewDto<CommentViewDto[]>> {
    return this.commentsService.getCommentsForPost(postId, query);
  }

  @Post()
  async createPost(@Body() body: PostInputDto) {
    return this.postsService.createPost(body);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() body: PostUpdateDto) {
    return this.postsService.updatePost(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
