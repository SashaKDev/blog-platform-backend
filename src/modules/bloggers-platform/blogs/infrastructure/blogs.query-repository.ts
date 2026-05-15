import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { BlogViewDto } from '../api/view-dto/blog.view-dto';
import { BlogsQueryParams } from '../api/input-dto/blog.query-params.input-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
    const foundBlog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!foundBlog) {
      throw new NotFoundException('blog not found');
    }

    return BlogViewDto.mapToView(foundBlog);
  }

  async findAllBlogs(
    query: BlogsQueryParams,
  ): Promise<BasePaginatedViewDto<BlogViewDto[]>> {
    const skip = query.pageSize * (query.pageNumber - 1);
    const filter: Record<string, unknown> = { deletedAt: null };
    if (query.searchNameTerm) {
      filter.name = { $regex: query.searchNameTerm, $options: 'i' };
    }
    const foundBlogs = await this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(skip)
      .limit(query.pageSize);

    const totalCount = await this.BlogModel.countDocuments(filter);

    const items = foundBlogs.map((blog) => {
      return BlogViewDto.mapToView(blog);
    });

    return BasePaginatedViewDto.mapToView<BlogViewDto[]>({
      items,
      totalCount,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });
  }
}
