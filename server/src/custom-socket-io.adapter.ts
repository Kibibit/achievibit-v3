import { Server, ServerOptions } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

import { IoAdapter } from '@nestjs/platform-socket.io';

export class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): Server {
    options = {
      ...options,
      // Use default path or adjust as needed
      path: '/socket.io',
      cors: {
        // Adjust for your security requirements
        origin: '*',
        methods: [ 'GET', 'POST' ]
      }
    };

    const server = super.createIOServer(port, options);

    instrument(server, {
      // Adjust authentication as needed
      auth: false,
      mode: 'development'
      // Specify the namespace if needed
      // namespaceName: '/admin',
    });

    return server;
  }
}
