import { Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim.decorator';

export class PostForBlogInputDto {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @Length(1, 1000)
  content: string;
}
