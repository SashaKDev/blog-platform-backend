import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserPayloadDto } from '../local/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from '../../../../config/core.config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(private coreConfig: CoreConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: coreConfig.accessTokenSecret,
    });
  }
  async validate(payload: UserPayloadDto): Promise<UserPayloadDto> {
    return payload;
  }
}
