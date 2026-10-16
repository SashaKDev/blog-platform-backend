import { Module } from '@nestjs/common';
import { BlogController } from './blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query-repository';
import { PostsController } from './posts/api/posts.controller';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query-repository';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CreateBlogHandler } from './blogs/application/handlers/create-blog.handler';
import { UpdateBlogHandler } from './blogs/application/handlers/update-blog.handler';
import { DeleteBlogHandler } from './blogs/application/handlers/delete-blog.handler';
import { CreatePostHandler } from './posts/application/handlers/create-post.handler';
import { DeletePostHandler } from './posts/application/handlers/delete-post.handler';
import { GetBlogByIdHandler } from './blogs/application/handlers/get-blog-by-id.handler';
import { UpdatePostLikeStatusHandler } from './posts/application/commands/update-post-like-status.command';
import {
  PostLike,
  PostLikeSchema,
} from './likes/posts-likes/domain/post-like.entity';
import { PostLikesRepository } from './likes/posts-likes/infrastructure/post-likes.repository';
import { GetPostByIdHandler } from './posts/application/queries/get-post-by-id.query';
import { GetAllPostsHandler } from './posts/application/queries/get-all-posts.query';
import { PostLikesQueryRepository } from './likes/posts-likes/infrastructure/post-likes.query-repository';
import { CreateCommentHandler } from './comments/application/commands/create-comment.command';
import { DeleteCommentHandler } from './comments/application/commands/delete-comment.command';
import { UpdateCommentHandler } from './comments/application/commands/update-comment.command';
import { CommentLikesRepository } from './likes/comments-likes/infrastructure/comment-likes.repository';
import {
  CommentLike,
  CommentLikeSchema,
} from './likes/comments-likes/domain/comment-like.entity';
import { UpdateCommentLikeStatusHandler } from './likes/comments-likes/application/commands/update-comment-like-status.command';
import { GetCommentByIdHandler } from './comments/application/queries/get-comment-by-id.query';
import { CommentLikesQueryRepository } from './likes/comments-likes/infrastructure/comment-likes.query-repository';
import { GetCommentsForPostHandler } from './comments/application/queries/get-comments-for-post.query';
import { GetAllBlogsHandler } from './blogs/application/handlers/get-all-blogs.handler';
import { GetPostsForBlogHandler } from './posts/application/queries/get-posts-for-blog.query';
import { UpdatePostHandler } from './posts/application/commands/update-post.command';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
  ],
  controllers: [BlogController, PostsController, CommentsController],
  providers: [
    // Blogs===================================================
    // Infrastructure
    BlogsRepository,
    BlogsQueryRepository,
    // Application
    BlogsService,
    // Handlers
    CreateBlogHandler,
    UpdateBlogHandler,
    DeleteBlogHandler,
    GetBlogByIdHandler,
    GetAllBlogsHandler,
    // Posts====================================================
    // Infrastructure
    PostsRepository,
    PostsQueryRepository,
    PostLikesRepository,
    PostLikesQueryRepository,
    // Application
    PostsService,
    // Handlers
    GetPostByIdHandler,
    GetAllPostsHandler,
    GetPostsForBlogHandler,
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,
    UpdatePostLikeStatusHandler,
    // Comments==================================================
    // Infrastructure
    CommentsRepository,
    CommentsQueryRepository,
    CommentLikesRepository,
    CommentLikesQueryRepository,
    // Application
    // Handlers
    GetCommentsForPostHandler,
    GetCommentByIdHandler,
    CreateCommentHandler,
    DeleteCommentHandler,
    UpdateCommentHandler,
    UpdateCommentLikeStatusHandler,
  ],
})
export class BloggersPlatformModule {}
