import { BlogInputDto } from '../../api/input-dto/blog.input-dto';

export class CreateBlogCommand {
  constructor(public readonly blogDto: BlogInputDto) {}
}
