import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  type PostLikeModelType,
} from '../domain/post-like.entity';
import { LikeStatuses } from '../../../../../core/enums/like-statuses.enum';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLike.name) private PostLikeModel: PostLikeModelType,
  ) {}

  async save(postLike: PostLikeDocument): Promise<void> {
    await postLike.save();
  }

  async findLike(
    postId: string,
    userId: string,
  ): Promise<PostLikeDocument | null> {
    return this.PostLikeModel.findOne({
      postId: postId,
      userId: userId,
    });
  }

  async countLikes(postId: string): Promise<number> {
    return this.PostLikeModel.countDocuments({
      postId: postId,
      status: LikeStatuses.Like,
      deletedAt: null,
    });
  }

  async countDislikes(postId: string): Promise<number> {
    return this.PostLikeModel.countDocuments({
      postId: postId,
      status: LikeStatuses.Dislike,
      deletedAt: null,
    });
  }

  async getNewestLikes(postId: string): Promise<PostLikeDocument[] | null> {
    const likes = await this.PostLikeModel.find({
      postId: postId,
      status: LikeStatuses.Like,
      deletedAt: null,
    })
      .sort({ updatedAt: -1 })
      .limit(3);

    return likes;
  }

  // async findById(id: string): Promise<BlogDocument | null> {
  //   return this.BlogModel.findOne({
  //     _id: id,
  //     deletedAt: null,
  //   });
  // }
  //
  // async findBlogsByPostIds(postIds: string[]): Promise<BlogDocument[]> {
  //   return this.BlogModel.find({ _id: { $in: postIds } });
  // }
  //
  // async findByIdOrNotFoundFail(id: string): Promise<BlogDocument> {
  //   const foundBlog = await this.BlogModel.findOne({
  //     _id: id,
  //     deletedAt: null,
  //   });
  //   if (!foundBlog) {
  //     throw new DomainException({
  //       message: 'blog not found',
  //       code: DomainExceptionCodes.NotFound,
  //     });
  //   }
  //   return foundBlog;
  // }
}
