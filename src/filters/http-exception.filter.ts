import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
    let message = '서버 내부 오류가 발생했습니다.';
    let code: string | undefined;
    let meta: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const responseObj = res as {
          message?: string | string[];
          code?: string;
          meta?: Record<string, unknown>;
        };

        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        }

        code = responseObj.code;
        meta = responseObj.meta;
      }
    }

    const errorBody: ErrorBody = {
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(code ? { code } : {}),
      ...(meta ? { meta } : {}),
    };

    const errorResponse: FailureResponse = {
      success: false,
      statusCode: status,
      data: errorBody,
    };

    response.status(status).json(errorResponse);
  }
}
