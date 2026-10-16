import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlogByIdQuery } from '../queries/get-blog-by-id.query';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: GetBlogByIdQuery): Promise<BlogViewDto> {
    return this.blogsQueryRepository.findByIdOrNotFoundFail(query.id);
  }
}
