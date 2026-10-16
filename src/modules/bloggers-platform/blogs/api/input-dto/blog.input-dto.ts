import { IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim.decorator';

export class BlogInputDto {
  @Trim()
  @Length(2, 10)
  name: string;
  @Trim()
  @Length(1, 100)
  description: string;
  @IsUrl()
  websiteUrl: string;
}
