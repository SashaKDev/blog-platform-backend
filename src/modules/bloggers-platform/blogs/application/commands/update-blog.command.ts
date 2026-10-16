import { BlogUpdateDto } from '../../api/input-dto/blog.update-dto';

export class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly blogUpdateDto: BlogUpdateDto,
  ) {}
}
