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
  UseGuards,
} from '@nestjs/common';
import { UserInputDto } from './input-dto/user.inpu-dto';
import { UserViewDto } from './view-dto/user.view-dto';
import { UsersQueryParams } from './input-dto/users.query-params.input-dto';
import { BasePaginatedViewDto } from '../../../../core/dto/base.paginated-view.dto';
import { BasicGuard } from '../../auth/guards/basic/basic.guard';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/commands/delete-user.command';
import { GetUserByIdQuery } from '../application/queries/get-user-by-id.query';
import { GetUsersQuery } from '../application/queries/get-users.query';

@UseGuards(BasicGuard)
@Controller('users')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<UserViewDto> {
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  @Get()
  async getUsers(
    @Query() query: UsersQueryParams,
  ): Promise<BasePaginatedViewDto<UserViewDto[]>> {
    return this.queryBus.execute(new GetUsersQuery(query));
  }

  @Post()
  async createUser(@Body() userDto: UserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(userDto),
    );
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
