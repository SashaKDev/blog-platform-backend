import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostInputDto } from '../api/input-dto/post.input-dto';
import { Post, PostDocument } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { PostUpdateDto } from '../api/input-dto/post.update-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { PostsQueryParams } from '../api/input-dto/posts.query-params.input-dto';
import { PostForBlogInputDto } from '../api/input-dto/post-for-blog.input-dto';
import { BlogsService } from '../../blogs/application/blogs.service';
import { newestLikesMock } from '../../../../core/newestLikesMock';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsRepository: BlogsRepository,
    private blogsService: BlogsService,
  ) {}

  async getPostById(id: string): Promise<PostViewDto> {
    const post = await this.postsRepository.findByIdOrNotFoundFail(id);

    return PostViewDto.mapToView(post, newestLikesMock);
  }

  async getAllPosts(
    query: PostsQueryParams,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    const posts: PostDocument[] =
      await this.postsQueryRepository.getAllPosts(query);
    const totalCount = await this.postsRepository.countDocuments();

    const items: PostViewDto[] = posts.map((post) => {
      return PostViewDto.mapToView(post, newestLikesMock);
    });

    return BasePaginatedViewDto.mapToView<PostViewDto[]>({
      items,
      totalCount,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });
  }

  async getPostsForBlog(
    blogId: string,
    query: PostsQueryParams,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {

    const blog = await this.blogsRepository.findByIdOrNotFoundFail(blogId);
    const posts = await this.postsQueryRepository.getPostsForBlog(
      blogId,
      query,
    );

    return PostViewDto.
  }

  async createPost(post: PostInputDto): Promise<PostViewDto> {
    const blog = await this.blogsRepository.findByIdOrNotFoundFail(post.blogId);

    const newPost = this.PostModel.createInstance(post, blog.name);
    await this.postsRepository.save(newPost);

    return PostViewDto.mapToView(newPost, newestLikesMock);
  }

  async createPostForBlog(
    blogId: string,
    dto: PostForBlogInputDto,
  ): Promise<PostViewDto> {
    const blog = await this.blogsService.getBlogOrNotFoundFail(blogId);

    const newPost = this.PostModel.createInstance(
      { ...dto, blogId: blogId },
      blog.name,
    );

    await this.postsRepository.save(newPost);

    return PostViewDto.mapToView(newPost, newestLikesMock);
  }

  async updatePost(id: string, dto: PostUpdateDto): Promise<void> {
    const post = await this.postsRepository.findByIdOrNotFoundFail(id);
    post.update(dto);
    await this.postsRepository.save(post);
  }

  async deletePost(id: string): Promise<void> {
    const foundPost = await this.postsRepository.findByIdOrNotFoundFail(id);

    foundPost.makeDeleted();

    await this.postsRepository.save(foundPost);
  }
}
