import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async findBlogsByPostIds(postIds: string[]): Promise<BlogDocument[]> {
    return this.BlogModel.find({ _id: { $in: postIds } });
  }

  async findByIdOrNotFoundFail(id: string): Promise<BlogDocument> {
    const foundBlog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!foundBlog) {
      throw new DomainException({
        message: 'blog not found',
        code: DomainExceptionCodes.NotFound,
      });
    }
    return foundBlog;
  }
}
