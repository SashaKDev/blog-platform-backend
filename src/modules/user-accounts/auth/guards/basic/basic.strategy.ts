import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as PassportBasicStrategy } from 'passport-http';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../../core/exceptions/domain-exception-codes';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from '../../../../config/core.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(
  PassportBasicStrategy,
  'basic',
) {
  constructor(private coreConfig: CoreConfig) {
    super();
  }

  async validate(login: string, password: string): Promise<boolean> {
    if (
      login !== this.coreConfig.basicLogin ||
      password !== this.coreConfig.basicPassword
    ) {
      throw new DomainException({
        message: 'Auth forbidden',
        code: DomainExceptionCodes.Unauthorized,
      });
    }
    return true;
  }
}
