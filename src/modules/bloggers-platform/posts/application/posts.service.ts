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

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
    private blogsService: BlogsService,
  ) {}

  async getPostById(id: string): Promise<PostViewDto> {
    const post = await this.postsRepository.findByIdOrNotFoundFail(id);
    const blog = await this.blogsRepository.findByIdOrNotFoundFail(post.blogId);

    return PostViewDto.mapToView(post, blog.name, newestLikesMock);
  }

  async getAllPosts(
    query: PostsQueryParams,
  ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
    const posts: PostDocument[] = await this.postsRepository.getAllPosts(query);
    const totalCount = await this.postsRepository.countDocuments();
    const blogIds = posts.map((post) => post.blogId);
    const blogs = await this.blogsRepository.findBlogsByPostIds(blogIds);

    const blogsMap = new Map(
      blogs.map((blog) => [blog._id.toString(), blog.name]),
    );

    const items: PostViewDto[] = posts.map((post) => {
      let blogName = blogsMap.get(post.blogId);
      if (!blogName) {
        blogName = 'deleted blog';
      }
      return PostViewDto.mapToView(post, blogName, newestLikesMock);
    });

    return BasePaginatedViewDto.mapToView<PostViewDto[]>({
      items,
      totalCount,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });
  }

  async createPost(post: PostInputDto): Promise<PostViewDto> {
    const blog = await this.blogsRepository.findByIdOrNotFoundFail(post.blogId);

    const newPost = this.PostModel.createInstance(post);
    await this.postsRepository.save(newPost);

    return PostViewDto.mapToView(newPost, blog.name, newestLikesMock);
  }

  async createPostForBlog(
    blogId: string,
    dto: PostForBlogInputDto,
  ): Promise<PostViewDto> {
    const blog = await this.blogsService.getBlogOrNotFoundFail(blogId);

    const newPost = this.PostModel.createInstance({ ...dto, blogId: blogId });

    await this.postsRepository.save(newPost);

    return PostViewDto.mapToView(newPost, blog.name, newestLikesMock);
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
