import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputDto } from '../api/input-dto/user.inpu-dto';
import UsersQueryRepository from '../infrastructure/users.query-repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async createUser(userDto: UserInputDto): Promise<string> {
    const newUser = this.UserModel.createInstance(userDto);
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.email = userDto.email;

    await this.usersRepository.save(newUser);

    return newUser._id.toString();
  }

  async deleteUser(userId: string): Promise<void> {
    const foundUser =
      await this.usersRepository.findUserByIdOrNotFoundFail(userId);

    foundUser.makeDeleted();

    await this.usersRepository.save(foundUser);
  }
}
