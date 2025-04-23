import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

interface FieldError {
  field: string;
  message: string;
}
interface ErrorBody {
  message: string;
  path: string;
  timestamp: string;
  code?: string;
  meta?: Record<string, unknown>;
  fieldErrors?: FieldError[];
}

interface FailureResponse {
  success: false;
  statusCode: number;
  data: ErrorBody;
}

function parseFieldErrors(errors: ValidationError[]): FieldError[] {
  return errors.flatMap((error) => {
    const messages = error.constraints
      ? Object.values(error.constraints)
      : ['invalid value'];

    return messages.map((msg) => ({
      field: error.property,
      message: msg,
    }));
  });
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 내부 오류가 발생했습니다.';
    let code: string | undefined;
    let meta: Record<string, unknown> | undefined;
    let fieldErrors: FieldError[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as {
          message?: string | ValidationError[];
          errorCode?: string;
          meta?: Record<string, unknown>;
        };

        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        }

        code = responseObj.errorCode;
        meta = responseObj.meta;

        if (
          Array.isArray(responseObj.message) &&
          responseObj.message.length > 0 &&
          responseObj.message[0].constraints
        ) {
          fieldErrors = parseFieldErrors(responseObj.message);
          message = fieldErrors.map((e) => `${e.message}`).join(', ');
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        }
      }
    }

    const errorBody: ErrorBody = {
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(code ? { code } : {}),
      ...(meta ? { meta } : {}),
      ...(fieldErrors ? { fieldErrors } : {}),
    };

    const errorResponse: FailureResponse = {
      success: false,
      statusCode: status,
      data: errorBody,
    };

    response.status(status).json(errorResponse);
  }
}
