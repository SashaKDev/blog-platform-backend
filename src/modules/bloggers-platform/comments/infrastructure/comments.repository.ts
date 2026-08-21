import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsRepository {
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

  async testCreateComment(): Promise<void> {
    const testComment = {
      postId: '6a54ec26cbf49b051cf40afc',
      content: 'fake fake all fake',
      userId: '1234568',
      userLogin: 'login login',
      likesCount: 1,
      dislikesCount: 1,
    };

    await this.CommentModel.insertOne(testComment);
  }
}
