import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      if (exception.getStatus() === 409) {
        return response.status(exception.getStatus()).json({
          message: exception.getResponse(),
          errors: 'Conflic',
        });
      }
      if (exception.getStatus() === 400) {
        return response.status(exception.getStatus()).json({
          message: exception.getResponse(),
          errors: 'Bad Request',
        });
      }
      if (exception.getStatus() === 404) {
        return response.status(exception.getStatus()).json({
          message: exception.getResponse(),
          errors: 'Not Found',
        });
      }
      response.status(exception.getStatus()).json({
        message: exception.getResponse(),
        errors: 'Error',
      });
    } else if (exception instanceof ZodError) {
      const getPathRequired = exception.errors.map((err) => {
        const path = err.path.join(', ');
        return { path, message: err.message };
      });

      response.status(400).json({
        message: getPathRequired,
        errors: 'Validation error',
      });
    } else {
      response.status(500).json({
        message: exception.message,
        errors: 'Internal Server Error',
      });
    }
  }
}
