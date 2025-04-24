import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomExceptionResponse {
  message: string;
  errorCode: string;
  meta?: Record<string, unknown> | null;
  status?: HttpStatus;
}

export class CustomException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    meta?: Record<string, unknown> | null,
    status?: HttpStatus,
  ) {
    const response: CustomExceptionResponse = {
      message,
      errorCode,
      meta,
    };
    super(response, status || HttpStatus.BAD_REQUEST);
  }
}
