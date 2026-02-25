import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'tasks',
  cors: { origin: '*' },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TasksGateway.name);
  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)?.add(client.id);
      this.logger.log(`User ${userId} connected (socket: ${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('subscribe-project')
  handleProjectSubscribe(client: Socket, projectId: string) {
    client.join(`project:${projectId}`);
    this.logger.log(`Client ${client.id} subscribed to project:${projectId}`);
    return { status: 'subscribed' };
  }

  @SubscribeMessage('unsubscribe-project')
  handleProjectUnsubscribe(client: Socket, projectId: string) {
    client.leave(`project:${projectId}`);
    this.logger.log(`Client ${client.id} unsubscribed from project:${projectId}`);
    return { status: 'unsubscribed' };
  }

  emitTaskCreated(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('task:created', task);
  }

  emitTaskUpdated(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('task:updated', task);
  }

  emitTaskStatusChanged(projectId: string, taskId: string, status: string) {
    this.server.to(`project:${projectId}`).emit('task:status-changed', { taskId, status });
  }

  emitTaskAssigned(projectId: string, taskId: string, assignedToId: string) {
    this.server.to(`project:${projectId}`).emit('task:assigned', { taskId, assignedToId });
    const sockets = this.userSockets.get(assignedToId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('task:assigned-to-me', taskId);
      });
    }
  }

  emitTaskDeleted(projectId: string, taskId: string) {
    this.server.to(`project:${projectId}`).emit('task:deleted', { taskId });
  }

  emitTaskDeadlineWarning(userId: string, taskId: string, hoursRemaining: number) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('task:deadline-warning', { taskId, hoursRemaining });
      });
    }
  }
}
