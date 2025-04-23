import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomExceptionResponse {
  message: string;
  code: string;
  meta?: Record<string, unknown>;
}

export class CustomException extends HttpException {
  constructor(message: string, code: string, meta?: Record<string, unknown>) {
    const response: CustomExceptionResponse = { message, code, meta };
    super(response, HttpStatus.BAD_REQUEST);
  }
}
