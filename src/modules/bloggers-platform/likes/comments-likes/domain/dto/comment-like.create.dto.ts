import { LikeStatuses } from '../../../../../../core/enums/like-statuses.enum';

export class CommentLikeCreateDto {
  commentId: string;
  userId: string;
  userLogin: string;
  status: LikeStatuses;
}
