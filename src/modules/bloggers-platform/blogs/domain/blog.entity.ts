import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogInputDto } from '../api/input-dto/blog.input-dto';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: Boolean, required: true, default: false })
  isMembership: boolean;

  static createInstance(blogDto: BlogInputDto): BlogDocument {
    const newBlog = new this();
    newBlog.name = blogDto.name;
    newBlog.description = blogDto.description;
    newBlog.websiteUrl = blogDto.websiteUrl;

    return newBlog as BlogDocument;
  }

  sayHi(): void {
    console.log(`${this.name} hi`);
  }

  update(dto: BlogInputDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }

  makeDeleted(): void {
    this.deletedAt = new Date();
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & typeof Blog;
