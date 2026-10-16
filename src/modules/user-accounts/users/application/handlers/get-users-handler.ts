import { GetUsersQuery } from '../queries/get-users.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import UsersQueryRepository from '../../infrastructure/users.query-repository';
import { BasePaginatedViewDto } from '../../../../../core/dto/base.paginated-view.dto';
import { UserViewDto } from '../../api/view-dto/user.view-dto';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(
    query: GetUsersQuery,
  ): Promise<BasePaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getUsers(query.usersQueryParams);
  }
}
