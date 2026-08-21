import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, type PostModelType } from '../domain/post.entity';
import type { QueryFilter } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async countDocuments(
    filter: QueryFilter<PostDocument> = {},
  ): Promise<number> {
    const baseFilter = { deletedAt: null };
    const mergedFilter = { ...baseFilter, ...filter };
    return this.PostModel.countDocuments(mergedFilter);
  }

  // async findById(id: string): Promise<BlogDocument | null> {
  //   return this.BlogModel.findOne({
  //     _id: id,
  //     isDeleted: null,
  //   });
  // }
  //
  async findByIdOrNotFoundFail(id: string): Promise<PostDocument> {
    const foundPost = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!foundPost) {
      throw new NotFoundException('post not found');
    }
    return foundPost;
  }
}
