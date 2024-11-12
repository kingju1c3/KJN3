export class NetworkProtocols {
  constructor(node) {
    this.node = node;
    this.handlers = new Map();
    this.setupProtocols();
  }

  setupProtocols() {
    this.registerProtocol('/secure/1.0.0', this.handleSecureMessage.bind(this));
    this.registerProtocol('/heartbeat/1.0.0', this.handleHeartbeat.bind(this));
    this.registerProtocol('/sync/1.0.0', this.handleSync.bind(this));
    this.registerProtocol('/emergency/1.0.0', this.handleEmergency.bind(this));
  }

  registerProtocol(protocol, handler) {
    this.handlers.set(protocol, handler);
    this.node.handle(protocol, async ({ stream }) => {
      const message = await this.receiveMessage(stream);
      await handler(message, stream);
    });
  }

  async handleSecureMessage(message, stream) {
    await this.sendMessage(stream, { status: 'received' });
  }

  async handleHeartbeat(message, stream) {
    await this.sendMessage(stream, { status: 'alive' });
  }

  async handleSync(message, stream) {
    await this.sendMessage(stream, { status: 'synced' });
  }

  async handleEmergency(message, stream) {
    await this.sendMessage(stream, { status: 'emergency_acknowledged' });
  }

  async receiveMessage(stream) {
    let message = '';
    for await (const chunk of stream.source) {
      message += new TextDecoder().decode(chunk);
    }
    return JSON.parse(message);
  }

  async sendMessage(stream, data) {
    await stream.sink([new TextEncoder().encode(JSON.stringify(data))]);
  }
}