import { IsMongoId, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim.decorator';

export class PostInputDto {
  @Trim()
  @Length(1, 20)
  title: string;
  @Trim()
  @Length(1, 50)
  shortDescription: string;
  @Trim()
  @Length(1, 100)
  content: string;
  @IsMongoId()
  blogId: string;
}
