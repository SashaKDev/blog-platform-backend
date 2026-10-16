import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MyProfileViewDto } from '../../api/view-dto/my-profile.view-dto';
import UsersQueryRepository from '../../../users/infrastructure/users.query-repository';

export class GetMyProfileQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMyProfileQuery)
export class GetMyProfileHandler implements IQueryHandler<GetMyProfileQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(query: GetMyProfileQuery): Promise<MyProfileViewDto> {
    const user = await this.usersQueryRepository.findUserByIdOrNotFoundFail(
      query.userId,
    );
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }
}
