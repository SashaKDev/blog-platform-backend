import { IsMongoId } from 'class-validator';

export class MongoIdInputDto {
  @IsMongoId()
  id: string;
}
