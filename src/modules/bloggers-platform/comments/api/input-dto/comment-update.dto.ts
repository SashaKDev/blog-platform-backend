import { Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim.decorator';

export class CommentUpdateDto {
  @Trim()
  @Length(20, 300)
  content: string;
}
