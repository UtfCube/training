import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const isAuthError = exception.name === 'UnauthorizedError';
    let errorMessage: string | object;

    if (isAuthError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      response.status(401).json({
        message: 'Please, login to use this api',
      });
    } else if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      errorMessage = exception.getResponse();
      response.status(exception.getStatus()).json({
        message: errorMessage,
        timestamp: new Date().toUTCString(),
        path: request.url,
      });
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      errorMessage = 'Internal server error';
      response.status(500).json({
        message: errorMessage,
      });
    }

    if (!isAuthError) {
      console.error('Exception: ', errorMessage, exception.stack);
    }
  }
}
