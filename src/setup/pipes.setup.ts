import {
  ValidationError,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import {
  DomainException,
  Extension,
} from '../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../core/exceptions/domain-exception-codes';

export const errorFormatter = (errors: ValidationError[]): Extension[] => {
  const formatedErrors: Extension[] = [];
  errors.forEach((error) => {
    if (error.constraints) {
      const message = Object.values(error.constraints)[0];
      formatedErrors.push({ field: error.property, message: message });
    }
  });
  return formatedErrors;
};

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  //На следующем занятии рассмотрим подробнее
  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer создает экземпляр dto
      //соответственно применятся значения по-умолчанию
      //и методы классов dto
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formatedErrors = errorFormatter(errors);

        throw new DomainException({
          message: 'Validation failed',
          code: DomainExceptionCodes.ValidationError,
          extensions: formatedErrors,
        });
      },
    }),
  );
}
