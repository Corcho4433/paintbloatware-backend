export class ServerError extends Error {
  public error_code: number;

  constructor(message: string, error_code: number | undefined) {
    super(message);

    let new_error_code = error_code === undefined ? 500 : 0

    this.error_code = new_error_code
    this.name = this.constructor.name
  }
}

export class BadRequest extends ServerError {
  constructor(message: string | undefined) {
    super(message != undefined ? message : "Bad Request", 400);
  }
}

export class Unauthorized extends ServerError {
  constructor(message: string | undefined) {
    super(message != undefined ? message : "Bad Request", 401);
  }
}

export class Forbidden extends ServerError {
  constructor(message: string | undefined) {
    super(message !== undefined ? message : "Forbidden", 403);
  }
}

export class NotFound extends ServerError {
  constructor(message?: string) {
    super(message !== undefined ? message : "Resource not found", 404);
  }
}

export class ValidationError extends ServerError {
  constructor(message: string | undefined) {
    super(message !== undefined ? message : "Validation error", 422);
  }
}

export class AuthError extends ServerError {
  constructor() {
    super("Authorization error", 500);
  }
}