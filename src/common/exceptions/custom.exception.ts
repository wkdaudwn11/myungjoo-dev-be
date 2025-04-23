import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomExceptionResponse {
  message: string;
  errorCode: string;
  meta?: Record<string, unknown>;
}

export class CustomException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    meta?: Record<string, unknown>,
  ) {
    const response: CustomExceptionResponse = {
      message,
      errorCode,
      meta,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}
