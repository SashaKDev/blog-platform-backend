import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import type { CommentModelType } from '../domain/comment.entity';
import { CommentViewDto } from '../api/view-dto/comment.view-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { CommentsQueryParams } from '../api/input-dto/comments.query-params.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async findByIdOrNotFoundFail(commentId: string): Promise<CommentViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    });
    console.log(comment);

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return CommentViewDto.mapToView(comment);
  }

  async getCommentsForPost(
    postId: string,
    query: CommentsQueryParams,
  ): Promise<BasePaginatedViewDto<CommentViewDto[]>> {
    const filter = {
      deletedAt: null,
      postId: postId,
    };

    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection;

    const skip = (pageNumber - 1) * pageSize;

    const totalCount = await this.CommentModel.countDocuments(filter);

    const comments = await this.CommentModel.find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip(skip)
      .limit(pageSize);

    const items = comments.map((comment) => {
      return CommentViewDto.mapToView(comment);
    });

    return BasePaginatedViewDto.mapToView<CommentViewDto[]>({
      items,
      totalCount,
      pageNumber,
      pageSize,
    });
  }
}
