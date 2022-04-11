import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    let message = exception.getResponse();
    if (typeof message === 'object') {
      message = (message as any).message;
    }

    response
      .status(statusCode)
      .json({ statusCode, path: `${request.method}:${request.url}`, message });
  }
}
