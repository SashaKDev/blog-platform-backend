import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostLikeCreateDto } from './dto/post-like.create.dto';
import { LikeStatuses } from '../../../../../core/enums/like-statuses.enum';

@Schema({ timestamps: true })
export class PostLike {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: String, enum: LikeStatuses, required: true })
  status: LikeStatuses;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(likeDto: PostLikeCreateDto): PostLikeDocument {
    const newPostLike = new this();
    newPostLike.userId = likeDto.userId;
    newPostLike.postId = likeDto.postId;
    newPostLike.status = likeDto.status;
    newPostLike.userLogin = likeDto.userLogin;

    return newPostLike as PostLikeDocument;
  }

  setLikeStatus(likeStatus: LikeStatuses) {
    this.status = likeStatus;
  }
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.loadClass(PostLike);

export type PostLikeDocument = HydratedDocument<PostLike>;

export type PostLikeModelType = Model<PostLikeDocument> & typeof PostLike;
