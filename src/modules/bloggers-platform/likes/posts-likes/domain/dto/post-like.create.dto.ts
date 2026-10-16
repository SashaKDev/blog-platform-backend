import { LikeStatuses } from '../../../../../../core/enums/like-statuses.enum';

export class PostLikeCreateDto {
  postId: string;
  userId: string;
  userLogin: string;
  status: LikeStatuses;
}
