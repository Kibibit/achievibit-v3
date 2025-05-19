import { join } from 'path';

import axios from 'axios';
import { makeBadge } from 'badge-maker';
import { writeJSON } from 'fs-extra';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { configService } from '@kb-config';

import { getSwaggerCoverageReport, swaggerCoverageMiddleware } from './middleware/swagger-coverage.middleware';
import { SwaggerLintService } from './swagger-lint.service';

interface ISwaggerMethod {
  get: (attr: string) => string;
}

export class Documentation {
  static logger = new Logger(Documentation.name);
  static title = 'achievibit';
  static swaggerPath = 'api/docs';
  static config = new DocumentBuilder()
    .setTitle('achievibit-api')
    .addBearerAuth({
      type: 'http',
      description: 'JWT token for authenticated user routes'
    })
    .addCookieAuth('user_token', {
      type: 'apiKey',
      description: 'JWT token for authenticated user routes'
    })
    .addSecurity('gitlab-webhook', {
      type: 'apiKey',
      name: 'x-gitlab-token',
      in: 'header',
      description: 'Secret token for GitLab webhooks validation (usually sent by GitLab)'
    })
    .addSecurity('github-webhook', {
      type: 'apiKey',
      name: 'x-hub-signature-256',
      in: 'header',
      description: 'Secret token for GitHub webhooks validation (usually sent by GitHub)'
    })
    .addSecurity('bitbucket-webhook', {
      type: 'apiKey',
      name: 'x-hub-signature',
      in: 'header',
      description: 'Secret token for Bitbucket webhooks validation (usually sent by Bitbucket)'
    })
    .setDescription([
      '![swagger-mode](https://img.shields.io/badge/',
      `mode-${ configService.config.NODE_ENV }-`,
      `${ configService.isDevelopmentMode ? 'FF5BF8' : '8A2BE2' }`,
      ')\n\n',
      // coverage badge
      // '![swagger-coverage](http://localhost:10102/api/coverage-badge)\n\n',
      // 'The achievibit API description.\n\n',
      'Since this swagger shares the same domain as the app, ',
      'you can use the same cookie for authentication.',
      '\n\n',
      'For the WebSocket API, please visit [achievibit-ws](/api/docs-async)'
    ].join(''))
    .setVersion('1.0')
    .setContact(
      'thatkookooguy',
      'https://github.com/thatkookooguy',
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
    await Documentation.addSwagger(
      app,
      'api/coverage',
      true,
      `.response-coverage-badge,
.coverage-badge {
  display: block;
}

.swagger-ui .topbar .topbar-wrapper a::before {
  content: 'API Test Coverage';
}

.swagger-ui .topbar .kb-tabs,
.swagger-ui section.models {
  display: none;
}

.scheme-container,
.model-example,
.opblock-section,
.execute-wrapper,
.expand-operation,
.swagger-ui .opblock.is-open .opblock-summary::after,
.info .description,
.info .info__contact,
.swagger-ui .response-controls,
.swagger-ui .response-col_links:not(.col_header) {
  display: none;
}

input, select, textarea, .swagger-ui .authorization__btn {
  pointer-events: none !important;
}
  
.swagger-ui .topbar .topbar-wrapper::after {
  content: attr(data-coverage, '(run tests for coverage)');
}

.undocumented-response-row {
  border: 2px solid #FFB710;
}

.undocumented-response-row .response-coverage-badge {
  color: #FFB710 !important;
}

tr.response.undocumented-response-row *:before {
    color: #FFB710 !important;
}
`
    );
    // await Documentation.addAsyncApi(app);

    app.getHttpAdapter().getInstance().get('/api/swagger-lint', (req, res) => {
      res.json(SwaggerLintService.runLint(join(configService.appRoot, 'swagger.json')));
    });
  }

  static addCoverage(app: INestApplication) {
    // Register your coverage middleware
    app.use(
      swaggerCoverageMiddleware({
        docsPath: join(configService.appRoot, 'swagger.json'),
        enable: true
      })
    );

    // Add an endpoint to expose the report
    app.getHttpAdapter().getInstance().get('/api/swagger-coverage-report', (req, res) => {
      res.json(getSwaggerCoverageReport());
    });

    // add shield with coverage percentage
    app.getHttpAdapter().getInstance().get('/api/coverage-badge', (req, res) => {
      const report = getSwaggerCoverageReport();
      const coverage = report.coverage || 0;
      const color = coverage < 50 ? 'red' : coverage < 80 ? 'orange' : 'green';

      const badge = makeBadge({
        label: 'swagger-coverage',
        message: `${ coverage.toFixed(2) }%`,
        color,
        style: 'for-the-badge',
        labelColor: '#222222'
      });

      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(badge);
    });
  }

  static async addSwagger(
    app: INestApplication,
    swaggerPath = Documentation.swaggerPath,
    expandOnDefault = false,
    extraCss = ''
  ) {
    const document = SwaggerModule.createDocument(app, Documentation.config);

    // write the swagger document to a file
    await writeJSON(configService.appRoot + '/swagger.json', document, { spaces: 2 });

    const swaggerCssResponse = await axios
      .get('https://kibibit.io/kibibit-assets/swagger/swagger.css');
    const customCss = swaggerCssResponse.data;

    SwaggerModule.setup(swaggerPath, app, document, {
      customSiteTitle: Documentation.title,
      customCss: `${ customCss }
[id*="BitbucketController"] .opblock-summary-description:before,
[id*="bitbucket"] .opblock-summary-description:before,
[id*="BitBucket"] .opblock-summary-description:before,
[id*="Bitbucket"] .opblock-summary-description:before {
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

[id*="GithubController"] .opblock-summary-description:before,
[id*="github"] .opblock-summary-description:before,
[id*="GitHub"] .opblock-summary-description:before,
[id*="Github"] .opblock-summary-description:before {
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

[id*="GitlabController"] .opblock-summary-description:before,
[id*="gitlab"] .opblock-summary-description:before,
[id*="GitLab"] .opblock-summary-description:before,
[id*="Gitlab"] .opblock-summary-description:before {
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

[id$="Dev"] .opblock-summary-description:after {
    transform: translateY(1px);
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin-left: .5em;
    content: '';
    display: inline-block;
    height: 20px;
    width: 20px;
    background-color: #ff5bf8;
    mask-image: url(https://simpleicons.org/icons/devdotto.svg);
}

.swagger-ui.swagger-container {
  min-height: calc(100dvh - 81.5px);
  display: flex;
  flex-direction: column;
}

.swagger-ui .opblock .opblock-summary-description {
  padding: 1em 1em 1em 0;
}

.swagger-ui .opblock-description-wrapper h4,
.swagger-ui .opblock-external-docs-wrapper h4,
.swagger-ui .opblock-title_normal h4,
.swagger-ui .dialog-ux .modal-ux-content p {
  color: var(--put-color);
}

.swagger-ui .opblock-control-arrow {
  width: 50px;
}

.swagger-ui .topbar .kb-tabs {
  display: flex;
  font-size: 0.7em;
  justify-content: center;
  align-items: center;
  padding: 0.5em 1.7em 0;
  text-align: center;
}

.swagger-ui .topbar .kb-tabs a {
  font-family: 'Comfortaa';
  font-weight: 100;
  cursor: pointer;
  padding-top: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swagger-ui .topbar .kb-tabs a.active {
  color: #FF5BF8;
  font-weight: 900;
}

.swagger-ui .topbar .topbar-wrapper a::before {
  content: 'Dev Center';
}

.response {
  position: relative;
}

.response-coverage-badge,
.coverage-badge {
  display: none;
  background: #222222;
  padding: 0.3em 0.5em;
  border-radius: 5px;
  width: fit-content;
}

.swagger-ui table.responses-table tbody tr td:first-of-type {
  min-width: 10em;
}

.response-col_links {
  display: none;
}

${ extraCss }
      `.trim(),
      customJs: [
        '//kibibit.io/kibibit-assets/swagger/swagger.js',
        '/login/swagger-tabs.js'
      ],
      swaggerOptions: {
        docExpansion: expandOnDefault ? 'full' : 'none',
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
