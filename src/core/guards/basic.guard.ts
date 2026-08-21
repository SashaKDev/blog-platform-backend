import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DomainException } from '../exceptions/domain-exception';
import { DomainExceptionCodes } from '../exceptions/domain-exception-codes';

@Injectable()
export class BasicGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    throw new DomainException({
      message: 'Auth forbidden.',
      code: DomainExceptionCodes.Unauthorized,
    });
  }
}
