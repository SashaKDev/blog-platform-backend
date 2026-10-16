import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../domain-exception';
import { DomainExceptionCodes } from '../domain-exception-codes';

@Catch(DomainException)
export class DomainExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.mapToHttpStatus(exception.code);

    // Более полный ответ
    // response.status(status).json({
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   message: exception.message,
    //   extensions: exception.extensions,
    //   code: status,
    // });
    // Ответ для тестов инкубатора
    response.status(status).json({
      errorsMessages: exception.extensions,
    });
  }

  private mapToHttpStatus(code: DomainExceptionCodes): number {
    switch (code) {
      case DomainExceptionCodes.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCodes.BadRequest:
      case DomainExceptionCodes.ValidationError:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCodes.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case DomainExceptionCodes.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCodes.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
