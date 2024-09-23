import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


export async function setupDocumentation(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('achievibit-api')
    .setDescription('The achievibit API description. For the WebSocket API, please visit [achievibit-ws](/async-api)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('achievibit-ws')
    .setDescription('For API documentation, please visit [achievibit-api](/api)')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    .addServer('achievibit-ws', {
      url: 'ws://localhost:3000',
      protocol: 'socket.io'
    })
    .build();

  const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('async-api', app, asyncApiDocument);
}
