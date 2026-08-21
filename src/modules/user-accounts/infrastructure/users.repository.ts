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
}
