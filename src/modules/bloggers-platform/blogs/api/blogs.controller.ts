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
import { BlogInputDto } from './input-dto/blog.input-dto';

import { BlogViewDto } from './view-dto/blog.view-dto';
import { BlogUpdateDto } from './input-dto/blog.update-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { BlogsQueryParams } from './input-dto/blog.query-params.input-dto';
import { PostViewDto } from '../../posts/api/view-dto/post.view-dto';
import { PostForBlogInputDto } from '../../posts/api/input-dto/post-for-blog.input-dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params.input-dto';
import { PostInputDto } from '../../posts/api/input-dto/post.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/commands/create-blog.command';
import { UpdateBlogCommand } from '../application/commands/update-blog.command';
import { DeleteBlogCommand } from '../application/commands/delete-blog.command';
import { MongoIdInputDto } from '../../../../core/dto/mongo-id.input-dto';
import { CreatePostCommand } from '../../posts/application/commands/create-post.command';
import { GetPostsForBlogQuery } from '../../posts/application/queries/get-posts-for-blog.query';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query';
import { GetAllBlogsQuery } from '../application/queries/get-all-blogs.query';
import { OptionalJwtGuard } from '../../../user-accounts/auth/guards/access-token/optional-jwt.guard';
import { ExtractUserFromRequest } from '../../../user-accounts/auth/guards/decorators/extract-user-from-request.decorator';
import { UserPayloadDto } from '../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { BasicGuard } from '../../../../core/guards/basic.guard';

@Controller('blogs')
export class BlogController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}
  @Get(':id')
  async getBlog(@Param() params: MongoIdInputDto): Promise<BlogViewDto> {
    return this.queryBus.execute(new GetBlogByIdQuery(params.id));
  }

  @Get()
  async getAllBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedViewDto<BlogViewDto[]>> {
    console.log(query);
    return this.queryBus.execute(new GetAllBlogsQuery(query));
  }

  @Get(':blogId/posts')
  @UseGuards(OptionalJwtGuard)
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: PostsQueryParams,
    @ExtractUserFromRequest() user: UserPayloadDto,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    return this.queryBus.execute(new GetPostsForBlogQuery(blogId, query, user));
  }

  @Post()
  @UseGuards(BasicGuard)
  async createBlog(@Body() blogInputDto: BlogInputDto): Promise<BlogViewDto> {
    const newBlogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(blogInputDto),
    );

    return this.queryBus.execute(new GetBlogByIdQuery(newBlogId));
  }

  @Post(':blogId/posts')
  @UseGuards(BasicGuard)
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() dto: PostForBlogInputDto,
  ): Promise<PostViewDto> {
    const postDto: PostInputDto = { ...dto, blogId: blogId };
    return this.commandBus.execute(new CreatePostCommand(postDto));
  }

  @Put(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() blogUpdateDto: BlogUpdateDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateBlogCommand(id, blogUpdateDto));
  }

  @Delete(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }
}
