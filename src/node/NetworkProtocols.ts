import { logger } from '../utils/logger';

export class NetworkProtocols {
  private node: any;
  private handlers: Map<string, Function>;

  constructor(node: any) {
    this.node = node;
    this.handlers = new Map();
    this.setupProtocols();
  }

  private setupProtocols() {
    this.registerProtocol('/secure/1.0.0', this.handleSecureMessage.bind(this));
    this.registerProtocol('/heartbeat/1.0.0', this.handleHeartbeat.bind(this));
    this.registerProtocol('/sync/1.0.0', this.handleSync.bind(this));
    this.registerProtocol('/emergency/1.0.0', this.handleEmergency.bind(this));
  }

  registerProtocol(protocol: string, handler: Function) {
    this.handlers.set(protocol, handler);
    this.node.handle(protocol, async ({ stream }: { stream: any }) => {
      try {
        const message = await this.receiveMessage(stream);
        await handler(message, stream);
      } catch (error) {
        logger.error(`Protocol handler error: ${error.message}`);
        throw error;
      }
    });
  }

  async handleSecureMessage(message: any, stream: any) {
    await this.sendMessage(stream, { status: 'received' });
  }

  async handleHeartbeat(message: any, stream: any) {
    await this.sendMessage(stream, { status: 'alive' });
  }

  async handleSync(message: any, stream: any) {
    await this.sendMessage(stream, { status: 'synced' });
  }

  async handleEmergency(message: any, stream: any) {
    await this.sendMessage(stream, { status: 'emergency_acknowledged' });
  }

  async receiveMessage(stream: any) {
    let message = '';
    for await (const chunk of stream.source) {
      message += new TextDecoder().decode(chunk);
    }
    return JSON.parse(message);
  }

  async sendMessage(stream: any, data: any) {
    await stream.sink([new TextEncoder().encode(JSON.stringify(data))]);
  }
}