import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let message = 'Internal server error';
    switch (exception.code) {
      case 'P2025':
        response.statusCode = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;
      default:
        response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        console.error(exception.message);
    }
    response.json({
      statusCode: response.statusCode,
      message,
    });
  }
}
