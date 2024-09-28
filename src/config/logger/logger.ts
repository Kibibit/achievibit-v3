import { Logger as NestLogger } from '@nestjs/common';

export class Logger {
  private readonly internalLogger = new NestLogger();
  constructor(private context: string) {}

  log(message: string, meta?: Record<string, any>) {
    this.internalLogger.log(message, { context: this.context, ...meta });
  }

  error(message: string | Error, meta?: Record<string, any>): void {
    let error;

    if (meta && meta instanceof Error) {
      error = meta;
      meta = null;
    }

    if (meta?.error && meta.error instanceof Error) {
      error = meta.error;
      delete meta.error;
    }

    if (message instanceof Error) {
      error = message;
      message = error.message;
    }

    const returnedObject: Record<string, any> = { context: this.context, ...meta };
    if (error) {
      returnedObject.stack = error.stack;
    }

    this.internalLogger.error(message, returnedObject);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.internalLogger.warn(message, { context: this.context, ...meta });
  }

  debug(message: string, meta?: Record<string, any>) {
    this.internalLogger.debug(message, { context: this.context, ...meta });
  }

  verbose(message: string, meta?: Record<string, any>) {
    this.internalLogger.verbose(message, { context: this.context, ...meta });
  }

  info(message: string, meta?: Record<string, any>) {
    this.internalLogger.log(message, { context: this.context, ...meta });
  }
}
