import { PostInputDto } from '../../api/input-dto/post.input-dto';

export class CreatePostCommand {
  constructor(public readonly postDto: PostInputDto) {}
}
