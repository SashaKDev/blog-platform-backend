import { Trim } from '../../../../../core/decorators/trim.decorator';
import { IsMongoId, Length } from 'class-validator';

export class PostUpdateDto {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @Length(1, 1000)
  content: string;
  @Trim()
  @IsMongoId()
  blogId: string;
}
