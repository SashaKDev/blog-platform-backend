import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RefreshTokenGuard } from '../../auth/guards/refresh-token/refresh-token.guard';
import { ExtractRefreshTokenPayloadFromRequest } from '../../auth/guards/decorators/extract-refresh-token-payload-from-request';
import { RefreshTokenPayload } from '../../auth/guards/refresh-token/dto/refresh-token-payload';
import { SessionViewDto } from './dto/session.view-dto';
import { GetDevicesQuery } from '../application/queries/get-devices.query';
import { TerminateDeviceCommand } from '../application/commands/terminate-device.command';
import { TerminateAllOtherDevicesCommand } from '../application/commands/terminate-all-other-devices.command';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getDevices(
    @ExtractRefreshTokenPayloadFromRequest() payload: RefreshTokenPayload,
  ): Promise<SessionViewDto[]> {
    return this.queryBus.execute(new GetDevicesQuery(payload));
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateDevice(
    @ExtractRefreshTokenPayloadFromRequest() payload: RefreshTokenPayload,
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    return this.commandBus.execute(
      new TerminateDeviceCommand(deviceId, payload),
    );
  }

  @Delete()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateAllOtherDevices(
    @ExtractRefreshTokenPayloadFromRequest() payload: RefreshTokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new TerminateAllOtherDevicesCommand(payload),
    );
  }
}
