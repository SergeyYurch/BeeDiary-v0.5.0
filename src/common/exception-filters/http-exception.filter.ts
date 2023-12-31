import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NotificationResult } from '../notification/notificationResult';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse = {
        errorsMessages: [],
      };
      const bodyResponse: any = exception.getResponse();
      if (bodyResponse instanceof NotificationResult) {
        bodyResponse.extensions.forEach((ext) => {
          errorResponse.errorsMessages.push({
            message: ext.message || 'error',
            field: ext.key || 'unknown',
          });
        });
        return;
      }
      if (Array.isArray(bodyResponse.message)) {
        bodyResponse.message.forEach((m) =>
          errorResponse.errorsMessages.push(m),
        );
      } else {
        errorResponse.errorsMessages.push({
          message: bodyResponse?.message?.message || 'error',
          field: bodyResponse?.message?.field || 'unknown',
        });
      }
      return response.status(status).json(errorResponse);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
