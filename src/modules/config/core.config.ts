import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { configValidationUtility } from './config-validation.utility';
import type { StringValue } from 'ms';

@Injectable()
export class CoreConfig {
  @IsNumber({}, { message: 'Set port variable' })
  port: number;

  @IsNotEmpty({ message: 'Set mongo uri' })
  mongoUri: string;

  @IsEmail({}, { message: 'Set gmail username' })
  gmailName: string;

  @IsNotEmpty({ message: 'Set gmail password' })
  gmailPassword: string;

  @IsNotEmpty({ message: 'Set access token secret' })
  accessTokenSecret: string;

  @IsNotEmpty({ message: 'Set refresh token secret' })
  refreshTokenSecret: string;

  @IsNotEmpty({ message: 'Set access token expiring time' })
  accessTokenExpiringTime: StringValue;

  @IsNotEmpty({ message: 'Set refresh token expiring time' })
  refreshTokenExpiringTime: StringValue;

  @IsNotEmpty({ message: 'Set login for basic auth' })
  basicLogin: string;

  @IsNotEmpty({ message: 'Set password for basic auth' })
  basicPassword: string;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get<string>('PORT'));
    this.mongoUri = this.configService.get<string>('MONGODB_URI')!;
    this.gmailName = this.configService.get<string>('GMAIL_NAME')!;
    this.gmailPassword = this.configService.get<string>('GMAIL_PASSWORD')!;
    this.accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    )!;
    this.refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    )!;
    this.accessTokenExpiringTime = this.configService.get<StringValue>(
      'ACCESS_TOKEN_EXPIRING_TIME',
    )!;
    this.refreshTokenExpiringTime = this.configService.get<StringValue>(
      'REFRESH_TOKEN_EXPIRING_TIME',
    )!;
    this.basicLogin = this.configService.get<string>('BASIC_LOGIN')!;
    this.basicPassword = this.configService.get<string>('BASIC_PASSWORD')!;
    configValidationUtility.validateConfig(this);
  }
}
