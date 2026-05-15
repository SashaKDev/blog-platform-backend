import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export class BlogsQueryParams extends BaseQueryParams {
  searchNameTerm: string;
  sortBy = BlogsSortBy.CreatedAt;
}

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
}
