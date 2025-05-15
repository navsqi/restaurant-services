export interface IResponse<T> {
  statusCode?: any;
  message?: any;
  data?: T;
}
