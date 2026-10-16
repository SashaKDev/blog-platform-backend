import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  type BlogModelType,
} from '../../bloggers-platform/blogs/domain/blog.entity';
import {
  Comment,
  CommentDocument,
} from '../../bloggers-platform/comments/domain/comment.entity';
import { Model } from 'mongoose';
import {
  Post,
  PostDocument,
} from '../../bloggers-platform/posts/domain/post.entity';
import {
  User,
  UserDocument,
} from '../../user-accounts/users/domain/user.entity';
import { Session } from 'node:inspector';
import { SessionDocument } from '../../user-accounts/sessions/domain/session.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Session.name) private SessionModel: Model<SessionDocument>,
  ) {}
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all-data')
  async clearDB(): Promise<void> {
    await this.BlogModel.deleteMany();
    await this.CommentModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.UserModel.deleteMany();
    await this.SessionModel.deleteMany();
  }
}
