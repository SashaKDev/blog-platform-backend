import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputDto } from '../api/input-dto/user.inpu-dto';
import { BcryptService } from '../../auth/application/crypto.service';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  // async createUser(userDto: UserInputDto): Promise<string> {
  //   const userWithSameLogin = await this.usersRepository.findByLogin(
  //     userDto.login,
  //   );
  //
  //   if (userWithSameLogin) {
  //     throw new DomainException({
  //       message: 'Creation failed',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [{ field: 'login', message: 'login already exists' }],
  //     });
  //   }
  //
  //   const userWithSameEmail = await this.usersRepository.findByEmail(
  //     userDto.email,
  //   );
  //
  //   if (userWithSameEmail) {
  //     throw new DomainException({
  //       message: 'Creation failed',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [{ field: 'email', message: 'email already exists' }],
  //     });
  //   }
  //
  //   const passwordHash = await this.bcryptService.hashPassword(
  //     userDto.password,
  //   );
  //
  //   const newUser = this.UserModel.createInstance({
  //     ...userDto,
  //     passwordHash: passwordHash,
  //   });
  //
  //   await this.usersRepository.save(newUser);
  //
  //   return newUser._id.toString();
  // }

  // async deleteUser(userId: string): Promise<void> {
  //   const foundUser =
  //     await this.usersRepository.findUserByIdOrNotFoundFail(userId);
  //
  //   foundUser.makeDeleted();
  //
  //   await this.usersRepository.save(foundUser);
  // }
}
