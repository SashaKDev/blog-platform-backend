import { INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from '../core/exceptions/filters/domain-exceptions.filter';

export function filtersSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  //На следующем занятии рассмотрим подробнее
  app.useGlobalFilters(new DomainExceptionsFilter());
}
