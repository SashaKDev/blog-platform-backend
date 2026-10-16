import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from '../../../../config/core.config';
import { RefreshTokenPayload } from './dto/refresh-token-payload';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private coreConfig: CoreConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies as Record<string, string> | undefined;
          return cookies?.['refreshToken'] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: coreConfig.refreshTokenSecret,
    });
  }
  async validate(payload: RefreshTokenPayload): Promise<RefreshTokenPayload> {
    console.log('in guard ' + JSON.stringify(payload));
    return payload;
  }
}
