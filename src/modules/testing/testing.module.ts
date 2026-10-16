import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from '../bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostSchema,
} from '../bloggers-platform/posts/domain/post.entity';
import {
  Comment,
  CommentSchema,
} from '../bloggers-platform/comments/domain/comment.entity';
import { User, UserSchema } from '../user-accounts/users/domain/user.entity';
import { TestingController } from './api/testing.controller';
import { Session } from 'node:inspector';
import { SessionSchema } from '../user-accounts/sessions/domain/session.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
