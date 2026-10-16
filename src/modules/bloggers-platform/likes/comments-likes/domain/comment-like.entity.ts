import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatuses } from '../../../../../core/enums/like-statuses.enum';
import { CommentLikeCreateDto } from './dto/comment-like.create.dto';

@Schema({ timestamps: true })
export class CommentLike {
  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: String, enum: LikeStatuses, required: true })
  status: LikeStatuses;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(likeDto: CommentLikeCreateDto): CommentLikeDocument {
    const newCommentLike = new this();
    newCommentLike.userId = likeDto.userId;
    newCommentLike.commentId = likeDto.commentId;
    newCommentLike.status = likeDto.status;
    newCommentLike.userLogin = likeDto.userLogin;

    return newCommentLike as CommentLikeDocument;
  }

  setLikeStatus(likeStatus: LikeStatuses) {
    this.status = likeStatus;
  }
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);

CommentLikeSchema.loadClass(CommentLike);

export type CommentLikeDocument = HydratedDocument<CommentLike>;

export type CommentLikeModelType = Model<CommentLikeDocument> &
  typeof CommentLike;
