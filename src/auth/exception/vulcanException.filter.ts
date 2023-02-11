import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(Error)
export class VulcanExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: response.statusCode,
      message: exception.message,
    });
  }
}
