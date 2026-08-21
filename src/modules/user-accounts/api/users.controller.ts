import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import UsersQueryRepository from '../infrastructure/users.query-repository';
import { UserInputDto } from './input-dto/user.inpu-dto';
import { UserViewDto } from './view-dto/user.view-dto';
import { UsersQueryParams } from './input-dto/users.query-params.input-dto';
import { BasePaginatedViewDto } from '../../../core/dto/base.paginated-view.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<UserViewDto> {
    return this.usersQueryRepository.findUserByIdOrNotFoundFail(userId);
  }

  @Get()
  async getUsers(
    @Query() query: UsersQueryParams,
  ): Promise<BasePaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getUsers(query);
  }

  @Post()
  async createUser(@Body() userDto: UserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(userDto);
    return this.usersQueryRepository.findUserByIdOrNotFoundFail(userId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }
}
