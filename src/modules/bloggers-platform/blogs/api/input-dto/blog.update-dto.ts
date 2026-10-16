import { IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim.decorator';

export class BlogUpdateDto {
  @Trim()
  @Length(1, 15)
  name: string;
  @Trim()
  @IsString()
  description: string;
  @Trim()
  @IsUrl()
  websiteUrl: string;
}
