import { SessionDocument } from '../../../sessions/domain/session.entity';

export class SessionViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(session: SessionDocument): SessionViewDto {
    return {
      ip: session.ip,
      title: session.deviceTitle,
      lastActiveDate: new Date(session.iat * 1000).toISOString(),
      deviceId: session.deviceId,
    };
  }
}
