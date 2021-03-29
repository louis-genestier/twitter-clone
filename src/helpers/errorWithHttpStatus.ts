class ErrorWithHttpStatus extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ErrorWithHttpStatus.prototype);
    this.status = status;
  }
}

export default ErrorWithHttpStatus;
