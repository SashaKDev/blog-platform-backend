export abstract class BasePaginatedViewDto<T> {
  items: T;
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;

  static mapToView<T>(data: {
    items: T;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  }): BasePaginatedViewDto<T> {
    return {
      items: data.items,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / data.pageSize),
      page: data.pageNumber,
      pageSize: data.pageSize,
    };
  }
}
