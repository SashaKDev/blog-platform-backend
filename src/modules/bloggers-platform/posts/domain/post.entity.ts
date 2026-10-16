import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostInputDto } from '../api/input-dto/post.input-dto';
import { PostUpdateDto } from '../api/input-dto/post.update-dto';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  static createInstance(postDto: PostInputDto, blogName: string): PostDocument {
    const newPost = new this();
    newPost.title = postDto.title;
    newPost.shortDescription = postDto.shortDescription;
    newPost.content = postDto.content;
    newPost.blogId = postDto.blogId;
    newPost.blogName = blogName;

    return newPost as PostDocument;
  }

  sayHi(): void {
    console.log(`${this.title} hi`);
  }

  update(dto: PostUpdateDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }

  makeDeleted(): void {
    this.deletedAt = new Date();
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
