import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class UsersQueryParams extends BaseQueryParams {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
}

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
}
