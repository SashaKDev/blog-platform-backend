import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
}

export class BlogsQueryParams extends BaseQueryParams {
  searchNameTerm: string;
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
}
