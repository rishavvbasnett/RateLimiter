export class HttpError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class ItemNotFoundError extends HttpError {
  constructor(message = "Item not found") {
    super(message, 404);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}
