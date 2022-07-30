class HttpError extends Error {
  status: number;
  constructor(public message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export default HttpError;
