import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from 'node:inspector';
import type {
  SessionDocument,
  SessionModelType,
} from '../domain/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async save(session: SessionDocument): Promise<void> {
    await session.save();
  }

  async findSessionByDeviceId(
    deviceId: string,
  ): Promise<SessionDocument | null> {
    return this.SessionModel.findOne({
      deviceId: deviceId,
      deletedAt: null,
    });
  }

  async findSessionByIdOrNotFoundFail(
    sessionId: string,
  ): Promise<SessionDocument> {
    const foundSession = await this.SessionModel.findOne({
      _id: sessionId,
      deletedAt: null,
    });
    if (!foundSession) {
      throw new NotFoundException('session not found');
    }
    return foundSession;
  }

  async findSessionByDeviceIdOrNotFoundFail(
    deviceId: string,
  ): Promise<SessionDocument> {
    console.log(deviceId);
    const foundSession = await this.SessionModel.findOne({
      deviceId: deviceId,
      deletedAt: null,
    });
    if (!foundSession) {
      throw new NotFoundException('session not found');
    }
    return foundSession;
  }

  async findSessionsOfUser(userId: string): Promise<SessionDocument[]> {
    return this.SessionModel.find({
      userId: userId,
      deletedAt: null,
    });
  }

  async terminateAllOtherDevices(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    await this.SessionModel.updateMany(
      {
        userId: userId,
        deviceId: { $ne: deviceId }, // ← все, кроме текущей
        deletedAt: null,
      },
      { deletedAt: new Date() },
    );
  }
}
