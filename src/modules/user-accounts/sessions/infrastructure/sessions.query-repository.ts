import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from 'node:inspector';
import type { SessionModelType } from '../domain/session.entity';
import { SessionViewDto } from '../../security-devices/api/dto/session.view-dto';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async getSessionsOfUser(userId: string): Promise<SessionViewDto[]> {
    const foundSessions = await this.SessionModel.find({
      userId: userId,
      deletedAt: null,
    });

    return foundSessions.map((session) => {
      return SessionViewDto.mapToView(session);
    });
  }
}
