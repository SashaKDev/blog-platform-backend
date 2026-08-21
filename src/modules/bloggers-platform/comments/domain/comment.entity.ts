import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: Number, required: true })
  likesCount: number;

  @Prop({ type: Number, required: true })
  dislikesCount: number;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  // static createInstance(commentDto: CommentInputDto): CommentDocument {
  //   const newComment = new this();
  //
  //   return newComment as CommentDocument;
  // }

  // sayHi(): void {
  //   console.log(`${this.name} hi`);
  // }

  // update(dto: CommentInputDto) {
  //
  // }

  makeDeleted(): void {
    this.deletedAt = new Date();
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
