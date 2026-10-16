import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  type PostLikeModelType,
} from '../domain/post-like.entity';

@Injectable()
export class PostLikesQueryRepository {
  constructor(
    @InjectModel(PostLike.name) private PostLikeModel: PostLikeModelType,
  ) {}

  async getLikesAndDislikesByPostIds(
    postIds: string[],
  ): Promise<PostLikeDocument[]> {
    return this.PostLikeModel.find({
      postId: { $in: postIds },
    });
  }

  async getLikesAndDislikesByPostId(
    postId: string,
  ): Promise<PostLikeDocument[]> {
    return this.PostLikeModel.find({ postId: postId });
  }
}
