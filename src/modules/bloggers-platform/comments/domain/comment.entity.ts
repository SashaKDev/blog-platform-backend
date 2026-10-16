import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(commentDto: CreateCommentDto): CommentDocument {
    const newComment = new this();

    newComment.content = commentDto.content;
    newComment.postId = commentDto.postId;
    newComment.userId = commentDto.userId;
    newComment.userLogin = commentDto.userLogin;

    return newComment as CommentDocument;
  }

  // sayHi(): void {
  //   console.log(`${this.name} hi`);
  // }
  //
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
