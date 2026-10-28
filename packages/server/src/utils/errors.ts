export class AppError extends Error {
   public readonly statusCode: number;
   public readonly code: string;
   public readonly details?: Record<string, string>;

   constructor(
      statusCode: number,
      code: string,
      message: string,
      details?: Record<string, string>,
   ) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
      this.details = details;
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this, this.constructor);
   }
}

export class ValidationError extends AppError {
   constructor(
      message: string = "Validation failed",
      details?: Record<string, string>,
   ) {
      super(400, "VALIDATION_ERROR", message, details);
   }
}

export class BadRequestError extends AppError {
   constructor(message: string, details?: Record<string, string>) {
      super(400, "BAD_REQUEST", message, details);
   }
}

export class UnauthorizedError extends AppError {
   constructor(message: string = "Unauthorized access") {
      super(401, "UNAUTHORIZED", message);
   }
}

export class ForbiddenError extends AppError {
   constructor(message: string = "Forbidden access") {
      super(403, "FORBIDDEN", message);
   }
}

export class NotFoundError extends AppError {
   constructor(message: string = "Resource not found") {
      super(404, "NOT_FOUND", message);
   }
}

export class ConflictError extends AppError {
   constructor(message: string = "Resource conflict") {
      super(409, "CONFLICT", message);
   }
}
