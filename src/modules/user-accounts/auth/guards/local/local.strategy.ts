import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { UserPayloadDto } from './dto/user-payload.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUserCommand } from '../../application/commands/validate-user.command';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private commandBus: CommandBus) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(username: string, password: string): Promise<UserPayloadDto> {
    const user = await this.commandBus.execute<
      ValidateUserCommand,
      UserPayloadDto | null
    >(new ValidateUserCommand(username, password));
    if (!user) {
      throw new DomainException({
        message: 'invalid login or password',
        code: DomainExceptionCodes.Unauthorized,
      });
    }
    return user;
  }
}
