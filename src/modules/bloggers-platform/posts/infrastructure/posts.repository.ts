import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async countDocuments(): Promise<number> {
    return this.PostModel.countDocuments({ deletedAt: null });
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
