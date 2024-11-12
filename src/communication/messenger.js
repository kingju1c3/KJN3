class Messenger {
  constructor(node) {
    this.node = node;
    this.messageQueue = new Map();
    this.callbacks = new Map();
  }

  async sendDirectMessage(targetPeerId, message, clearanceLevel) {
    if (!this.node.isOperational || (this.node.emergencyMode && clearanceLevel > 2)) {
      throw new Error('Cannot send message in current mode');
    }

    const encryptedMessage = this.node.encryptMessage(message, clearanceLevel);
    const messageId = CryptoJS.SHA256(Date.now() + message).toString();

    try {
      const { stream } = await this.node.node.dialProtocol(targetPeerId, '/direct/1.0.0');
      await this.node.sendToStream(stream, {
        id: messageId,
        content: encryptedMessage,
        clearanceLevel,
        sender: this.node.node.peerId.toString(),
        timestamp: Date.now(),
        requiresResponse: true
      });

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.callbacks.delete(messageId);
          reject(new Error('Message response timeout'));
        }, 30000);

        this.callbacks.set(messageId, {
          resolve,
          reject,
          timeout
        });
      });
    } catch (error) {
      throw new Error(`Failed to send direct message: ${error.message}`);
    }
  }

  async handleIncomingMessage(message) {
    if (!this.node.isOperational) return;

    const decryptedContent = this.node.decryptMessage(
      message.content,
      message.clearanceLevel
    );

    if (decryptedContent) {
      // Store message in queue
      this.messageQueue.set(message.id, {
        content: decryptedContent,
        sender: message.sender,
        timestamp: message.timestamp,
        clearanceLevel: message.clearanceLevel
      });

      // Send acknowledgment
      if (message.requiresResponse) {
        try {
          const { stream } = await this.node.node.dialProtocol(message.sender, '/ack/1.0.0');
          await this.node.sendToStream(stream, {
            id: message.id,
            status: 'received',
            timestamp: Date.now()
          });
        } catch (error) {
          console.error('Failed to send message acknowledgment:', error);
        }
      }
    }
  }

  async handleMessageAcknowledgment(ack) {
    const callback = this.callbacks.get(ack.id);
    if (callback) {
      clearTimeout(callback.timeout);
      this.callbacks.delete(ack.id);
      callback.resolve(ack);
    }
  }

  getMessages() {
    return Array.from(this.messageQueue.values());
  }
}

export default Messenger;