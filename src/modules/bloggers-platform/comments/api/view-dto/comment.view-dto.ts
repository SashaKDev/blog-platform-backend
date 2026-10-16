import { CommentDocument } from '../../domain/comment.entity';
import { LikeStatuses } from '../../../../../core/enums/like-statuses.enum';
import { CommentLikeDocument } from '../../../likes/comments-likes/domain/comment-like.entity';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
  };

  static mapToView(
    comment: CommentDocument,
    commentLikes?: CommentLikeDocument[],
    user?: UserPayloadDto,
  ): CommentViewDto {
    const dto = new CommentViewDto();

    const likesCount = commentLikes
      ? commentLikes.filter((l) => l.status === LikeStatuses.Like).length
      : 0;
    const dislikesCount = commentLikes
      ? commentLikes.filter((l) => l.status === LikeStatuses.Dislike).length
      : 0;
    const myStatus =
      user && commentLikes
        ? (commentLikes.find((l) => l.userId === user.userId)?.status ??
          LikeStatuses.None)
        : LikeStatuses.None;

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    };

    return dto;
  }
}
