import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  @Prop({
    type: {
      code: { type: String, required: true },
      isApplied: { type: Boolean, required: true, default: false },
    },
    required: true,
  })
  emailConfirmationInfo: {
    code: string;
    isApplied: boolean;
  };

  @Prop({
    type: {
      code: { type: String, required: true },
      isApplied: { type: Boolean, required: true, default: false },
    },
    required: true,
  })
  passwordRecoveryInfo: {
    code: string;
    isApplied: boolean;
  };

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(userDto: CreateUserDto): UserDocument {
    const newUser = new this();
    newUser.login = userDto.login;
    newUser.passwordHash = userDto.passwordHash;
    newUser.email = userDto.email;
    newUser.isEmailConfirmed = false;
    newUser.emailConfirmationInfo = { code: ' ', isApplied: false };
    newUser.passwordRecoveryInfo = { code: ' ', isApplied: false };

    return newUser as UserDocument;
  }

  sayHi(): void {
    console.log(`${this.login} hi`);
  }

  // update(dto: UserUpdateDto) {
  //
  // }

  setConfirmationInfo(confirmationCode: string): void {
    this.emailConfirmationInfo = { code: confirmationCode, isApplied: false };
  }

  resetConfirmationInfo(): void {
    this.emailConfirmationInfo.isApplied = true;
  }

  setPasswordRecoveryInfo(recoveryCode: string): void {
    this.passwordRecoveryInfo = { code: recoveryCode, isApplied: false };
  }

  setPassword(password: string): void {
    this.passwordHash = password;
  }

  makeEmailConfirmed(): void {
    this.isEmailConfirmed = true;
  }

  makeDeleted(): void {
    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
