import { UsersQueryParams } from '../../api/input-dto/users.query-params.input-dto';

export class GetUsersQuery {
  constructor(public readonly usersQueryParams: UsersQueryParams) {}
}
