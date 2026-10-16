import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async save(user: UserDocument): Promise<void> {
    await user.save();
  }

  async findUserByIdOrNotFoundFail(userId: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      deletedAt: null,
      _id: userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmationInfo.code': code,
    });
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'passwordRecoveryInfo.code': code,
    });
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      deletedAt: null,
      login: login,
    });
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      deletedAt: null,
      email: email,
    });
    return user;
  }
}
