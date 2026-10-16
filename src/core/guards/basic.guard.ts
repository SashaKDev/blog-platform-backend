import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DomainException } from '../exceptions/domain-exception';
import { DomainExceptionCodes } from '../exceptions/domain-exception-codes';
import { BasicLogin, BasicPassword } from '../../../settings';

@Injectable()
export class BasicGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authString = request.headers.authorization;
    if (!authString) {
      throw new DomainException({
        message: 'Auth forbidden.',
        code: DomainExceptionCodes.Unauthorized,
      });
    }

    const [authMethod, authCode] = authString.split(' ');

    if (authMethod !== 'Basic') {
      throw new DomainException({
        message: 'Auth forbidden.',
        code: DomainExceptionCodes.Unauthorized,
      });
    }

    const decodedAuthCode = Buffer.from(authCode, 'base64').toString('utf-8');
    const [login, password] = decodedAuthCode.split(':');

    if (login !== BasicLogin || password !== BasicPassword) {
      throw new DomainException({
        message: 'Auth forbidden.',
        code: DomainExceptionCodes.Unauthorized,
      });
    }

    return true;
  }
}
