export type PaginatedResult<T> = {
  meta: {
    page: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: T[];
};