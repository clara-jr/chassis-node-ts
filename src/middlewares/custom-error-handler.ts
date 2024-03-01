import { Request, Response, NextFunction } from 'express';

interface ErrorStatus extends Error {
  status: number;
  errorCode: string;
}

/**
 * https://expressjs.com/en/guide/error-handling.html
 * This function overrides default Express error handler.
 */
export default function (err: ErrorStatus, _req: Request, res: Response, next: NextFunction) {
  // If headers were already sent to client, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  if (!(err instanceof ApiError) && err.name === 'ValidationError') err = new ApiError(400, 'VALIDATION_ERROR', err.message);

  const { errorCode = 'UNKNOWN_ERROR', message = 'Unknown error' } = err;
  let { status } = err;

  // If the status code is outside the 4xx or 5xx range, set it to 500
  if (!Number.isInteger(status) || status < 400 || status > 599) {
    status = 500;
  }

  console.error(`🔴 ERROR with status ${status}: ${errorCode} ${message}`);
  if (status === 500) {
    console.error(err.stack);
  }

  res.status(status).json({ status, errorCode, message });
}

export class ApiError extends Error {
  status: number;
  errorCode: string;
  message: string;

  constructor(status = 500, errorCode = 'UNKNOWN_ERROR', message = 'Api error') {
    super();
    this.status = status;
    this.errorCode = errorCode;
    this.message = message;
    Error.captureStackTrace(this, ApiError);
  }
}