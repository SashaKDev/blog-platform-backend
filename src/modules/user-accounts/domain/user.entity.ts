import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UserInputDto } from '../api/input-dto/user.inpu-dto';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  email: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(userDto: UserInputDto): UserDocument {
    const newUser = new this();
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.email = userDto.email;

    return newUser as UserDocument;
  }

  sayHi(): void {
    console.log(`${this.login} hi`);
  }

  // update(dto: UserUpdateDto) {
  //
  // }

  makeDeleted(): void {
    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
