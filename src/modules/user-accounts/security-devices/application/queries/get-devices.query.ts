import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { SessionViewDto } from '../../api/dto/session.view-dto';
import { RefreshTokenPayload } from '../../../auth/guards/refresh-token/dto/refresh-token-payload';
import { SessionsQueryRepository } from '../../../sessions/infrastructure/sessions.query-repository';

export class GetDevicesQuery extends Query<SessionViewDto[]> {
  constructor(public readonly payload: RefreshTokenPayload) {
    super();
  }
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesHandler implements IQueryHandler<GetDevicesQuery> {
  constructor(private sessionsQueryRepository: SessionsQueryRepository) {}

  async execute(query: GetDevicesQuery): Promise<SessionViewDto[]> {
    return this.sessionsQueryRepository.getSessionsOfUser(query.payload.userId);
  }
}
