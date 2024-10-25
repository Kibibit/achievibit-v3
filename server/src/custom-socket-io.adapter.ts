import { Server, ServerOptions } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

import { IoAdapter } from '@nestjs/platform-socket.io';

export class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): Server {
    options = {
      ...options,
      path: '/socket.io', // Use default path or adjust as needed
      cors: {
        origin: '*', // Adjust for your security requirements
        methods: [ 'GET', 'POST' ]
      }
    };

    const server = super.createIOServer(port, options);

    instrument(server, {
      auth: false, // Adjust authentication as needed
      mode: 'development'
      // Specify the namespace if needed
      // namespaceName: '/admin',
    });

    return server;
  }
}
