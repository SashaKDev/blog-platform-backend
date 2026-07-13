import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model } from 'mongoose';
import { PostsQueryParams } from '../api/input-dto/posts.query-params.input-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getAllPosts(query: PostsQueryParams): Promise<PostDocument[]> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter = { deletedAt: null };
    return this.PostModel.find(filter)
      .sort({
        [query.sortBy]: query.sortDirection,
      })
      .skip(skip)
      .limit(query.pageSize);
  }

  async getPostsForBlog(
    blogId: string,
    query: PostsQueryParams,
  ): Promise<PostDocument[]> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter = { deletedAt: null, blogId: blogId };
    return this.PostModel.find(filter)
      .sort({
        [query.sortBy]: query.sortDirection,
      })
      .skip(skip)
      .limit(query.pageSize);
  }
}
