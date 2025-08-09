export class ServerError extends Error {
  public error_code: number;
  
  constructor(message: string, error_code?: number) {
    super(message);
    // ✅ Corregido: usa el error_code proporcionado o 500 por defecto
    this.error_code = error_code ?? 500;
    this.name = this.constructor.name;
  }
}

export class BadRequest extends ServerError {
  constructor(message?: string) {
    super(message ?? "Bad Request", 400);
  }
}

export class Unauthorized extends ServerError {
  constructor(message?: string) {
    // ✅ Corregido: mensaje por defecto para 401
    super(message ?? "Unauthorized", 401);
  }
}

export class Forbidden extends ServerError {
  constructor(message?: string) {
    super(message ?? "Forbidden", 403);
  }
}

export class NotFound extends ServerError {
  constructor(message?: string) {
    super(message ?? "Resource not found", 404);
  }
}

export class ValidationError extends ServerError {
  constructor(message?: string) {
    super(message ?? "Validation error", 422);
  }
}

export class AuthError extends ServerError {
  constructor(message?: string) {
    // ✅ Mejorado: permite mensaje personalizado y código 401 más apropiado
    super(message ?? "Authorization error", 401);
  }
}