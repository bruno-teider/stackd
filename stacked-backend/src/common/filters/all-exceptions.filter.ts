import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = (res as any).message || res;
      stack = (exception as any).stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    } else {
      message = exception as any;
    }

    const logEntry = {
      timestamp,
      status,
      method: request.method,
      url: request.url,
      body: request.body,
      message,
      stack,
    };

    // Log to Nest logger (console)
    this.logger.error(`${request.method} ${request.url} -> ${JSON.stringify(message)}`);
    if (stack) this.logger.error(stack);

    // Ensure logs directory exists and append to file
    try {
      const logsDir = path.resolve(__dirname, '../../../../logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      const file = path.join(logsDir, 'error.log');
      const text = `${timestamp} | ${request.method} ${request.url} | status=${status} | message=${JSON.stringify(message)}\n${stack ? stack + '\n' : ''}---\n`;
      await fs.promises.appendFile(file, text, { encoding: 'utf8' });
    } catch (fileErr) {
      // If file logging fails, still continue
      this.logger.warn('Failed to write error log file: ' + (fileErr as any).message);
    }

    // Send response to client
    response.status(status).json({
      statusCode: status,
      timestamp,
      path: request.url,
      error: message,
    });
  }
}
