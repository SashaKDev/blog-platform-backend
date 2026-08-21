import { IsUrl, Length } from 'class-validator';

export class BlogInputDto {
  @Length(1, 10)
  name: string;
  @Length(1, 100)
  description: string;
  @IsUrl()
  websiteUrl: string;
}
