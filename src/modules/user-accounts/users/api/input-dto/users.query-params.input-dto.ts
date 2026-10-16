import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
}

export class UsersQueryParams extends BaseQueryParams {
  @IsString()
  @IsOptional()
  searchLoginTerm?: string;
  @IsString()
  @IsOptional()
  searchEmailTerm?: string;
  @IsEnum(UsersSortBy)
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
}
