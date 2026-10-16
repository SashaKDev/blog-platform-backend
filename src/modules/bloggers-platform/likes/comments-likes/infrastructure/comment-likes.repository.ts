import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  type CommentLikeModelType,
} from '../domain/comment-like.entity';

@Injectable()
export class CommentLikesRepository {
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  async save(commentLike: CommentLikeDocument): Promise<void> {
    await commentLike.save();
  }

  async findLike(
    commentId: string,
    userId: string,
  ): Promise<CommentLikeDocument | null> {
    return this.CommentLikeModel.findOne({
      commentId: commentId,
      userId: userId,
    });
  }
}
