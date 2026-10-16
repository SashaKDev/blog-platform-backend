import { BlogsQueryParams } from '../../api/input-dto/blog.query-params.input-dto';

export class GetAllBlogsQuery {
  constructor(public readonly queryParams: BlogsQueryParams) {}
}
