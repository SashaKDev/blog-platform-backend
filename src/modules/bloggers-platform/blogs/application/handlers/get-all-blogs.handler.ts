import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBlogsQuery } from '../queries/get-all-blogs.query';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { BasePaginatedViewDto } from '../../../../../core/dto/base.paginated-view.dto';

@QueryHandler(GetAllBlogsQuery)
export class GetAllBlogsHandler implements IQueryHandler<GetAllBlogsQuery> {
  constructor(public readonly blogsQueryRepository: BlogsQueryRepository) {}

  async execute(
    query: GetAllBlogsQuery,
  ): Promise<BasePaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAllBlogs(query.queryParams);
  }
}
