export class GenericResponse<T> {
  constructor(
    public statusCode: number,
    public identity: string,
    public content: T
  ) { }
}
