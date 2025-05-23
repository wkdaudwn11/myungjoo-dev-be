import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { parseFieldErrors } from '@/common/utils/validation.util';

interface ErrorBody {
  message: string;
  path: string;
  timestamp: string;
  code?: string;
  meta?: Record<string, unknown>;
}

interface FailureResponse {
  success: false;
  statusCode: number;
  data: ErrorBody;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An internal server error has occurred.';
    let code: string | undefined;
    let meta: Record<string, unknown> = {};

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

        if (
          Array.isArray(responseObj.message) &&
          responseObj.message.length > 0 &&
          'constraints' in responseObj.message[0]
        ) {
          const fieldErrors = parseFieldErrors(responseObj.message);

          meta.fieldErrors = fieldErrors;
          message = fieldErrors.map((e) => e.message).join(', ');
          code = ErrorCode.VALIDATION_ERROR;
        } else {
          if (typeof responseObj.message === 'string') {
            message = responseObj.message;
          } else if (Array.isArray(responseObj.message)) {
            message = responseObj.message.join(', ');
          }

          code = responseObj.errorCode;
          if (responseObj.meta) {
            meta = { ...meta, ...responseObj.meta };
          }
        }
      }
    }

    const errorBody: ErrorBody = {
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(code ? { code } : {}),
      ...(Object.keys(meta).length > 0 ? { meta } : {}),
    };

    const errorResponse: FailureResponse = {
      success: false,
      statusCode: status,
      data: errorBody,
    };

    response.status(status).json(errorResponse);
  }
}
