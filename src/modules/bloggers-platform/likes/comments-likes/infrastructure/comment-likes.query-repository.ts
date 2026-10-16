import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  type CommentLikeModelType,
} from '../domain/comment-like.entity';

@Injectable()
export class CommentLikesQueryRepository {
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: CommentLikeModelType,
  ) {}

  async getLikesAndDislikesByCommentId(
    commentId: string,
  ): Promise<CommentLikeDocument[]> {
    return this.CommentLikeModel.find({
      commentId: commentId,
    });
  }

  async getLikesAndDislikesByCommentsIds(
    commentIds: string[],
  ): Promise<CommentLikeDocument[]> {
    return this.CommentLikeModel.find({
      commentId: { $in: commentIds },
    });
  }
}
