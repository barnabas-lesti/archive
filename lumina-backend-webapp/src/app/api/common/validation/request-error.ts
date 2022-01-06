export interface RequestError {
  type: string;
  message: string;
  path: string;
  invalidValue: string;
}
