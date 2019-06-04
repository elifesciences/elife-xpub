export class NotImplementedError extends Error {
  constructor(message: string = 'not implemented') {
    super(message);
    this.name = 'NotImplementedError';
  }
}
