export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    // Встановлює прототип для коректної роботи instanceof з класами помилок
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
