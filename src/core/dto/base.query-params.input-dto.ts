import { Type } from 'class-transformer';

export class BaseQueryParams {
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;
  sortDirection: sortDirection = sortDirection.DESC;
}

enum sortDirection {
  DESC = 'desc',
  ASC = 'asc',
}
