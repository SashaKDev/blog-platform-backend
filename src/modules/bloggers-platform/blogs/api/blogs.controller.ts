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
import { BlogInputDto } from './input-dto/blog.input-dto';

import { BlogViewDto } from './view-dto/blog.view-dto';
import { BlogUpdateDto } from './input-dto/blog.update-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { BlogsQueryParams } from './input-dto/blog.query-params.input-dto';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { PostViewDto } from '../../posts/api/view-dto/post.view-dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostForBlogInputDto } from '../../posts/api/input-dto/post-for-blog.input-dto';

@Controller('blogs')
export class BlogController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsService: PostsService,
  ) {}
  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.findByIdOrNotFoundFail(id);
  }

  @Get()
  async getAllBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAllBlogs(query);
  }

  @Post()
  async createBlog(@Body() blogInputDto: BlogInputDto): Promise<BlogViewDto> {
    const newBlogId = await this.blogsService.createBlog(blogInputDto);

    return this.blogsQueryRepository.findByIdOrNotFoundFail(newBlogId);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() dto: PostForBlogInputDto,
  ): Promise<PostViewDto> {
    console.log('dto', dto);
    return this.postsService.createPostForBlog(blogId, dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() blogUpdateDto: BlogUpdateDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(id, blogUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }
}
