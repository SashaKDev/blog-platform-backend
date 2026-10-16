// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from '../../users/domain/user.entity';
// import type { UserModelType } from '../../users/domain/user.entity';
// import { UserInputDto } from '../../users/api/input-dto/user.inpu-dto';
// import { generateCode } from '../../../../core/utils/generate-code';
// import { EmailService } from '../../../notification/infrastructure/email.service';
// import { UsersRepository } from '../../users/infrastructure/users.repository';
// import { DomainException } from '../../../../core/exceptions/domain-exception';
// import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception-codes';
// import { BcryptService } from './crypto.service';
// import { JwtService } from '@nestjs/access-token';
// import { UserPayloadDto } from '../../guards/local/dto/user-payload.dto';
// import { MyProfileViewDto } from '../api/view-dto/my-profile.view-dto';
// import { CommandBus } from '@nestjs/cqrs';
// import UsersQueryRepository from '../../users/infrastructure/users.query-repository';
//
// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private UserModel: UserModelType,
//     private usersQueryRepository: UsersQueryRepository,
//     private usersRepository: UsersRepository,
//
//     private emailService: EmailService,
//     private bcryptService: BcryptService,
//     private jwtService: JwtService,
//     private commandBus: CommandBus,
//   ) {}

  // async validateUser(
  //   userName: string,
  //   password: string,
  // ): Promise<UserPayloadDto | null> {
  //   const userByLogin = await this.usersRepository.findByLogin(userName);
  //   const userByEmail = await this.usersRepository.findByEmail(userName);
  //
  //   const user = userByLogin ? userByLogin : userByEmail;
  //
  //   if (!user) {
  //     return null;
  //   }
  //
  //   const passwordCompareResult = await this.bcryptService.comparePasswords(
  //     password,
  //     user.passwordHash,
  //   );
  //
  //   if (!passwordCompareResult) {
  //     return null;
  //   }
  //
  //   const payload = { id: user.id, login: user.login };
  //   return payload;
  // }

  // async login(payload: UserPayloadDto): Promise<{ accessToken: string }> {
  //   const accessToken = await this.jwtService.signAsync(payload);
  //   return {
  //     accessToken: accessToken,
  //   };
  // }

  // async registerUser(userDto: UserInputDto): Promise<void> {
  //   const newUserId = await this.commandBus.execute<CreateUserCommand, string>(
  //     new CreateUserCommand(userDto),
  //   );
  //
  //   const registeredUser =
  //     await this.usersRepository.findUserByIdOrNotFoundFail(newUserId);
  //
  //   const code = generateCode();
  //
  //   registeredUser.setConfirmationInfo(code);
  //   await this.usersRepository.save(registeredUser);
  //
  //   await this.emailService
  //     .sendConfirmationEmail(registeredUser.email, code)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // async confirmRegister(code: string): Promise<void> {
  //   const user = await this.usersRepository.findUserByConfirmationCode(code);
  //
  //   if (!user) {
  //     throw new DomainException({
  //       message: 'Email confirmation failed',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [
  //         { field: 'code', message: 'incorrect email confirmation code' },
  //       ],
  //     });
  //   }
  //
  //   if (user.isEmailConfirmed) {
  //     throw new DomainException({
  //       message: 'Email confirmation failed',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [{ field: 'code', message: 'email already confirmed' }],
  //     });
  //   }
  //
  //   if (user.emailConfirmationInfo.isApplied) {
  //     throw new DomainException({
  //       message: 'Email confirmation failed',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [
  //         { field: 'code', message: 'confirmation code already applied' },
  //       ],
  //     });
  //   }
  //
  //   // if (user.emailConfirmationInfo.code !== code) {
  //   //   throw new DomainException({
  //   //     message: 'incorrect email confirmation code',
  //   //     code: DomainExceptionCodes.BadRequest,
  //   //   });
  //   // }
  //
  //   user.resetConfirmationInfo();
  //   user.makeEmailConfirmed();
  //   await this.usersRepository.save(user);
  // }

  // async resendRegisterEmail(email: string): Promise<void> {
  //   const user = await this.usersRepository.findByEmail(email);
  //
  //   if (!user) {
  //     throw new DomainException({
  //       message: 'Incorrect email',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [{ field: 'email', message: 'incorrect email' }],
  //     });
  //   }
  //
  //   if (user.isEmailConfirmed) {
  //     throw new DomainException({
  //       message: 'Email confirmation failed',
  //       code: DomainExceptionCodes.BadRequest,
  //       extensions: [{ field: 'email', message: 'email already confirmed' }],
  //     });
  //   }
  //
  //   const newCode = generateCode();
  //
  //   user.setConfirmationInfo(newCode);
  //   await this.usersRepository.save(user);
  //
  //   await this.emailService
  //     .sendConfirmationEmail(email, newCode)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // async sendPasswordRecoveryEmail(email: string): Promise<void> {
  //   const user = await this.usersRepository.findByEmail(email);
  //   if (!user) {
  //     throw new DomainException({
  //       message: 'Incorrect email',
  //       code: DomainExceptionCodes.NotFound,
  //       extensions: [{ field: 'email', message: 'user does not exist' }],
  //     });
  //   }
  //
  //   const passwordRecoveryCode = generateCode();
  //   user.setPasswordRecoveryInfo(passwordRecoveryCode);
  //   await this.usersRepository.save(user);
  //
  //   await this.emailService
  //     .sendPasswordRecoveryEmail(email, passwordRecoveryCode)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // async changePassword(
  //   newPassword: string,
  //   recoveryCode: string,
  // ): Promise<void> {
  //   const user =
  //     await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);
  //
  //   if (!user) {
  //     throw new DomainException({
  //       message: 'incorrect recovery code',
  //       code: DomainExceptionCodes.BadRequest,
  //     });
  //   }
  //
  //   if (user.passwordRecoveryInfo.isApplied) {
  //     throw new DomainException({
  //       message: 'code already applied',
  //       code: DomainExceptionCodes.BadRequest,
  //     });
  //   }
  //
  //   const newHashedPassword =
  //     await this.bcryptService.hashPassword(newPassword);
  //
  //   user.setPassword(newHashedPassword);
  //   user.passwordRecoveryInfo.isApplied = true;
  //   await this.usersRepository.save(user);
  // }

  // async getMyProfile(userId: string): Promise<MyProfileViewDto> {
  //   const user = await this.usersQueryRepository.findUserByIdOrNotFoundFail(userId);
  //   return {
  //     email: user.email,
  //     login: user.login,
  //     userId: user.id,
  //   };
  // }
// }
