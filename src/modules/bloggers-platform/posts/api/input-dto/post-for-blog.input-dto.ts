import { Length } from 'class-validator';

export class PostForBlogInputDto {
  @Length(1, 20)
  title: string;
  @Length(1, 50)
  shortDescription: string;
  @Length(1, 100)
  content: string;
}
