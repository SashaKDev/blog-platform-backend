import { Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim.decorator';

export class CommentInputDto {
  @Trim()
  @Length(20, 300)
  content: string;
}
