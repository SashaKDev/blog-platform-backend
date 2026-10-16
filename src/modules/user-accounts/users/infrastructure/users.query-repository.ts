import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import { UserViewDto } from '../api/view-dto/user.view-dto';
import { UsersQueryParams } from '../api/input-dto/users.query-params.input-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';

@Injectable()
class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findUserByIdOrNotFoundFail(userId: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      deletedAt: null,
      _id: userId,
    });
    if (!user) {
      console.log('userId' + userId);
      console.log('user' + user);
      throw new NotFoundException('user not found');
    }

    return UserViewDto.mapToView(user);
  }

  async getUsers(
    query: UsersQueryParams,
  ): Promise<BasePaginatedViewDto<UserViewDto[]>> {
    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const searchLoginTerm = query.searchLoginTerm;
    const searchEmailTerm = query.searchEmailTerm;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    // const filter: QueryFilter<UserDocument> = { deletedAt: null };
    // const conditions: any[] = [];
    //
    // if (searchLoginTerm) {
    //   conditions.push({ $regex: searchLoginTerm, $options: 'i' });
    // }
    //
    // if (searchEmailTerm) {
    //   conditions.push({ $regex: searchEmailTerm, $options: 'i' });
    // }
    //
    // if (conditions.length > 0) {
    //   filter.$or = conditions;
    // }

    // Поиск по логину ИЛИ email
    const orConditions: any[] = [];

    if (searchLoginTerm) {
      orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (searchEmailTerm) {
      orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    const filter = {
      deletedAt: null,
      ...(orConditions.length > 0 && { $or: orConditions }),
    };

    const users = await this.UserModel.find(filter)
      .sort({
        [query.sortBy]: query.sortDirection,
      })
      .skip(skip)
      .limit(limit);

    const items = users.map((user) => {
      return UserViewDto.mapToView(user);
    });

    const totalCount = await this.UserModel.countDocuments(filter);

    return BasePaginatedViewDto.mapToView<UserViewDto[]>({
      items,
      totalCount,
      pageNumber,
      pageSize,
    });
  }
}

export default UsersQueryRepository;
