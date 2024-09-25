import axios from 'axios';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface ISwaggerMethod {
  get: (attr: string) => string;
}

export class Documentation {
  static logger = new Logger(Documentation.name);
  static title = 'achievibit';
  static swaggerPath = 'api/docs';
  static config = new DocumentBuilder()
    .setTitle('achievibit-api')
    .addBearerAuth()
    .setDescription('The achievibit API description. For the WebSocket API, please visit [achievibit-ws](/api-async)')
    .setVersion('1.0')
    .setContact(
      'thatkookooguy',
      'github.com/thatkookooguy',
      'thatkookooguy@kibibit.io'
    )
    .addTag(
      'default',
      'Utility api endpoints'
    )
    .build();

  static getOperationsSorter() {
    return (a: ISwaggerMethod, b: ISwaggerMethod) => {
      const methodsOrder = [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'options',
        'trace'
      ];
      let result =
        methodsOrder.indexOf( a.get('method') ) -
        methodsOrder.indexOf( b.get('method') );

      if (result === 0) {
        result = a.get('path').localeCompare(b.get('path'));
      }

      return result;
    };
  }

  static async addDocumentation(app: INestApplication) {
    await Documentation.addSwagger(app);
    await Documentation.addAsyncApi(app);
  }

  static async addSwagger(app: INestApplication) {
    const document = SwaggerModule.createDocument(app, Documentation.config);
    const swaggerCssResponse = await axios
      .get('https://kibibit.io/kibibit-assets/swagger/swagger.css');
    const customCss = swaggerCssResponse.data;

    SwaggerModule.setup(Documentation.swaggerPath, app, document, {
      customSiteTitle: Documentation.title,
      customCss: `${ customCss }
[id*="BitbucketController"] .opblock-summary-description:before {
    transform: translateY(3px);
    margin-right: .3em;
    content: '';
    display: inline-block;
    height: 16px;
    width: 16px;
    /* background-color: #0052CC; */
    background-color: white;
    mask-image: url(https://simpleicons.org/icons/bitbucket.svg);
}

[id*="GithubController"] .opblock-summary-description:before {
    transform: translateY(3px);
    margin-right: .3em;
    content: '';
    display: inline-block;
    height: 16px;
    width: 16px;
    /* background-color: #0052CC; */
    background-color: white;
    mask-image: url(https://simpleicons.org/icons/github.svg);
}

[id*="GitlabController"] .opblock-summary-description:before {
    transform: translateY(3px);
    margin-right: .3em;
    content: '';
    display: inline-block;
    height: 16px;
    width: 16px;
    /* background-color: #0052CC; */
    background-color: white;
    mask-image: url(https://simpleicons.org/icons/gitlab.svg);
}

.swagger-ui .opblock .opblock-summary-description {
  padding: 1em 1em 1em 0;
}

.swagger-ui .opblock-description-wrapper h4,
.swagger-ui .opblock-external-docs-wrapper h4,
.swagger-ui .opblock-title_normal h4 {
  color: var(--put-color);
}
      `.trim(),
      customJs: '//kibibit.io/kibibit-assets/swagger/swagger.js',
      swaggerOptions: {
        docExpansion: 'none',
        apisSorter: 'alpha',
        operationsSorter: Documentation.getOperationsSorter()
      }
    });

    this.logger.verbose(`Swagger documentation added to ${ Documentation.swaggerPath }`);
  }

  static async addAsyncApi(app: INestApplication) {
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
    await AsyncApiModule.setup(`${ Documentation.swaggerPath }-async`, app, asyncApiDocument);

    this.logger.verbose(`AsyncApi documentation added to ${ Documentation.swaggerPath }-async`);
  }
}
