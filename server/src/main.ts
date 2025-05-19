import { join } from 'path';

import { magenta, yellow } from 'colors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { existsSync } from 'fs-extra';
import { WinstonModule } from 'nest-winston';

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { configService, loggerInstance } from '@kb-config';

import { AppModule } from './app.module';
import { CustomSocketIoAdapter } from './custom-socket-io.adapter';
import { Documentation } from './documentation';
import { logo } from './logo';

import 'reflect-metadata';

bootstrap();

async function bootstrap() {
  const logger = new Logger('bootstrap');

  console.log(logo);
  console.log('\n');

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      snapshot: true,
      logger: WinstonModule.createLogger({
        instance: loggerInstance
      })
    }
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // Pass the raw ValidationError[] into the exception
      return new BadRequestException(errors);
    }
  }));
  // app.useGlobalInterceptors(new ErrorLoggingInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.enableShutdownHooks();

  app.disable('x-powered-by');
  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false
    })
  );

  app.enableCors();

  const clientPath = join(configService.appRoot, 'client');
  const loginAppPath = join(configService.appRoot, 'login-app');
  const testResultsPath = join(configService.appRoot, '..', 'test-results');
  const notFoundPath = join(configService.appRoot, '404');
  const socketIoAdminPath = join(configService.appRoot, 'node_modules', '@socket.io', 'admin-ui', 'ui', 'dist');

  app.useStaticAssets(clientPath, {
    // Cache static assets for 1 day
    maxAge: configService.isDevelopmentMode ? 0 : '1d'
  });

  app.useStaticAssets(loginAppPath, {
    // Cache static assets for 1 day
    maxAge: configService.isDevelopmentMode ? 0 : '1d',
    prefix: '/login'
  });

  // Custom middleware to handle test-results requests
  app.use('/test-results', (req, res, next) => {
    // Extract the relative path from the URL and remove query params
    const relativePath = req.url.split('?')[0];
    const fullPath = join(testResultsPath, relativePath);
    // Check if the test-results directory exists and if the specific file/folder exists
    if (existsSync(testResultsPath) && existsSync(fullPath)) {
      // If it exists, continue to the next middleware (standard static file handling)
      next();
    } else {
      // If not, serve the 404 application instead
      res.sendFile(join(notFoundPath, 'index.html'));
    }
  });

  // Still serve test-results if they exist for the static file middleware to work
  app.useStaticAssets(testResultsPath, {
    maxAge: 0,
    prefix: '/test-results'
  });

  app.useStaticAssets(socketIoAdminPath, {
    prefix: '/api/socket-io'
  });

  // Use your custom Socket.IO adapter (see next step)
  app.useWebSocketAdapter(new CustomSocketIoAdapter(app));

  await Documentation.addDocumentation(app);

  Documentation.addCoverage(app);

  await app.listen(configService.config.PORT);

  const appUrl = (await app.getUrl()).replace(
    /\[.*?\]/,
    'localhost'
  );
  logger.log(`Application is running on: ${ magenta(appUrl) }`);
  logger.log(`Running in ${ magenta(configService.config.NODE_ENV) } mode`);

  if (configService.config.NODE_ENV === 'devcontainer') {
    logger.verbose(`Client Proxy is running on: ${ yellow('http://localhost:10101') }`);
  }
}
