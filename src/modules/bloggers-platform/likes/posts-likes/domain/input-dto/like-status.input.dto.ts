import { IsEnum } from 'class-validator';
import { LikeStatuses } from '../../../../../../core/enums/like-statuses.enum';

export class LikeStatusInputDto {
  @IsEnum(LikeStatuses)
  likeStatus: LikeStatuses;
}
