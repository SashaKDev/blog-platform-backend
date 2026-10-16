import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadDto } from '../local/dto/user-payload.dto';
import { Request } from 'express';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayloadDto => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as UserPayloadDto;
  },
);
