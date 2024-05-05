export class PageResponseDto<T> {
  constructor(
    public totalCount: number,
    public totalPages: number,
    public currentPage: number,
    public pageSize: number,
    public content: T[]
  ) { }
}
