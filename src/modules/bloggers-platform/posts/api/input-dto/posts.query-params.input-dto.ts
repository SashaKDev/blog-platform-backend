import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export class PostsQueryParams extends BaseQueryParams {
  sortBy = PostsSortBy.CreatedAt;
}

export enum PostsSortBy {
  CreatedAt = 'createdAt',
}
