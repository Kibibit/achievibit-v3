import { Server, Socket } from 'socket.io';

import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { configService } from '@kb-config';

/**
 * Gateway for system events that don't require authentication.
 * Used for features like refreshing test results.
 */
@WebSocketGateway({ 
  cors: { origin: true, credentials: true },
  namespace: '/system'
})
export class SystemEventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(SystemEventsGateway.name);

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    this.logger.debug('System events client connected', { clientId: client.id || 'unknown' });
  }

  @SubscribeMessage('test-results-updated')
  handleTestResultsUpdated(@ConnectedSocket() client: Socket) {
    const clientId = client?.id || 'unknown';
    this.logger.log('Test results updated event received', { 
      clientId,
      event: 'test-results-updated'
    });
    
    // Broadcast to all clients that test results have been updated
    // delay the broadcast by 2 seconds to allow test results to be generated
    this.server.emit('refresh-test-results', { timestamp: new Date().toISOString() });
  
    this.logger.log('Refresh test results event broadcasted', {
      clientId,
      event: 'refresh-test-results'
    });
    
    return { 
      status: 'ok',
      message: 'Event processed successfully'
    };
  }
} 