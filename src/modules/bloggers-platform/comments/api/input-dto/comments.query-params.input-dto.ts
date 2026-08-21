import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export class CommentsQueryParams extends BaseQueryParams {
  sortBy: CommentsSortBy = CommentsSortBy.CreatedAt;
}

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
}
