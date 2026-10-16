import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
  Description = 'description',
  WebsiteUrl = 'websiteUrl',
  Id = 'id',
}

export class BlogsQueryParams extends BaseQueryParams {
  @IsString()
  @IsOptional()
  searchNameTerm: string;
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
}
