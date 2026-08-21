import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export class BaseQueryParams {
  @Type(() => Number)
  @IsInt()
  pageNumber: number = 1;
  @Type(() => Number)
  @IsInt()
  pageSize: number = 10;
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.DESC;
}
