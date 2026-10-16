import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenPayload } from '../refresh-token/dto/refresh-token-payload';

export const ExtractRefreshTokenPayloadFromRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RefreshTokenPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as RefreshTokenPayload;
  },
);
