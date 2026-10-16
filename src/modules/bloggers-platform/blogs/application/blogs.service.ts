import { Injectable } from '@nestjs/common';
import { BlogDocument } from '../domain/blog.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
  ) {}

  // async createBlog(blogDto: BlogInputDto): Promise<string> {
  //   const blog = this.BlogModel.createInstance(blogDto);
  //   await this.blogsRepository.save(blog);
  //   return blog._id.toString();
  // }

  // async updateBlog(id: string, blogUpdateDto: BlogUpdateDto): Promise<void> {
  //   const foundBlog = await this.blogsRepository.findByIdOrNotFoundFail(id);
  //
  //   foundBlog.update(blogUpdateDto);
  //
  //   await this.blogsRepository.save(foundBlog);
  // }

  // async deleteBlog(id: string): Promise<void> {
  //   const foundBlog = await this.blogsRepository.findByIdOrNotFoundFail(id);
  //
  //   foundBlog.makeDeleted();
  //
  //   await this.blogsRepository.save(foundBlog);
  // }

  // async getBlogOrNotFoundFail(id: string): Promise<BlogDocument> {
  //   return this.blogsRepository.findByIdOrNotFoundFail(id);
  // }
}
