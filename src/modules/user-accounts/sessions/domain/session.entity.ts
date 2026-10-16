import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  deviceTitle: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Number, required: true })
  iat: number;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(sessionDto: CreateSessionDto): SessionDocument {
    const newSession = new this();
    newSession.userId = sessionDto.userId;
    newSession.deviceId = sessionDto.deviceId;
    newSession.deviceTitle = sessionDto.deviceTitle;
    // newSession.iat = sessionDto.iat;
    newSession.ip = sessionDto.ip;
    return newSession as SessionDocument;
  }

  makeDeleted(): void {
    this.deletedAt = new Date();
  }

  updateIat(iat: number): void {
    this.iat = iat;
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.loadClass(Session);

export type SessionDocument = HydratedDocument<Session>;

export type SessionModelType = Model<SessionDocument> & typeof Session;
