import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { BlogsService } from '../../blogs/application/blogs.service';
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

  // async getPostById(id: string): Promise<PostViewDto> {
  //   const post = await this.postsRepository.findByIdOrNotFoundFail(id);
  //
  //   return PostViewDto.mapToView(post, newestLikesMock);
  // }

  // async getAllPosts(
  //   queries: PostsQueryParams,
  // ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
  //   const posts: PostDocument[] =
  //     await this.postsQueryRepository.getAllPosts(queries);
  //   const totalCount = await this.postsRepository.countDocuments();
  //
  //   const items: PostViewDto[] = posts.map((post) => {
  //     return PostViewDto.mapToView(post, newestLikesMock);
  //   });
  //
  //   return BasePaginatedViewDto.mapToView<PostViewDto[]>({
  //     items,
  //     totalCount,
  //     pageNumber: queries.pageNumber,
  //     pageSize: queries.pageSize,
  //   });
  // }

  // async getPostsForBlog(
  //   blogId: string,
  //   queries: PostsQueryParams,
  // ): Promise<BasePaginatedViewDto<PostViewDto[]>> {
  //   const blog = await this.blogsRepository.findByIdOrNotFoundFail(blogId);
  //   const posts = await this.postsQueryRepository.getPostsForBlog(
  //     blogId,
  //     queries,
  //   );
  //
  //   const items = posts.map((post) => {
  //     return PostViewDto.mapToView(post, newestLikesMock);
  //   });
  //
  //   const totalCount = await this.postsRepository.countDocuments({
  //     blogId: blogId,
  //   });
  //   const pageNumber = queries.pageNumber;
  //   const pageSize = queries.pageSize;
  //
  //   return BasePaginatedViewDto.mapToView<PostViewDto[]>({
  //     items,
  //     totalCount,
  //     pageNumber,
  //     pageSize,
  //   });
  // }

  // async createPost(post: PostInputDto): Promise<PostViewDto> {
  //   const blog = await this.blogsRepository.findByIdOrNotFoundFail(post.blogId);
  //
  //   const newPost = this.PostModel.createInstance(post, blog.name);
  //   await this.postsRepository.save(newPost);
  //
  //   return PostViewDto.mapToView(newPost, newestLikesMock);
  // }

  // async createPostForBlog(
  //   blogId: string,
  //   dto: PostForBlogInputDto,
  // ): Promise<PostViewDto> {
  //   const blog = await this.blogsService.getBlogOrNotFoundFail(blogId);
  //
  //   const newPost = this.PostModel.createInstance(
  //     { ...dto, blogId: blogId },
  //     blog.name,
  //   );
  //
  //   await this.postsRepository.save(newPost);
  //
  //   return PostViewDto.mapToView(newPost, newestLikesMock);
  // }

  // async updatePost(id: string, dto: PostUpdateDto): Promise<void> {
  //   const post = await this.postsRepository.findByIdOrNotFoundFail(id);
  //   post.update(dto);
  //   await this.postsRepository.save(post);
  // }

  // async deletePost(id: string): Promise<void> {
  //   const foundPost = await this.postsRepository.findByIdOrNotFoundFail(id);
  //
  //   foundPost.makeDeleted();
  //
  //   await this.postsRepository.save(foundPost);
  // }
}
