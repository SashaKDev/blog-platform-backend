import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import UsersQueryRepository from '../../infrastructure/users.query-repository';
import { UserViewDto } from '../../api/view-dto/user.view-dto';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}
  async execute(query: GetUserByIdQuery): Promise<UserViewDto> {
    return this.usersQueryRepository.findUserByIdOrNotFoundFail(query.userId);
  }
}
