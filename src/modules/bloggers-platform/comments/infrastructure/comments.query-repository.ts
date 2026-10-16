import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import type { CommentModelType } from '../domain/comment.entity';
import { CommentViewDto } from '../api/view-dto/comment.view-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { CommentsQueryParams } from '../api/input-dto/comments.query-params.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async findByIdOrNotFoundFail(commentId: string): Promise<CommentDocument> {
    const comment = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    });

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return comment;
  }

  async getCommentsForPost(
    postId: string,
    query: CommentsQueryParams,
  ): Promise<CommentDocument[]> {
    const filter = {
      deletedAt: null,
      postId: postId,
    };

    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection;

    const skip = (pageNumber - 1) * pageSize;

    return this.CommentModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(skip)
      .limit(pageSize);
  }

  async countDocuments(postId: string): Promise<number> {
    return this.CommentModel.countDocuments({ postId: postId });
  }
}
