import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
}

export class PostsQueryParams extends BaseQueryParams {
  @IsEnum(PostsSortBy)
  sortBy = PostsSortBy.CreatedAt;
}
