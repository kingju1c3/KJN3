import NetworkNode from './core/NetworkNode.js';
import { ClearanceLevel } from './security/ClearanceLevel.js';
import FirmwareManager from './firmware/FirmwareManager.js';
import CryptoJS from 'crypto-js';

class SecureNode extends NetworkNode {
  constructor(clearanceLevel) {
    if (!clearanceLevel || !clearanceLevel.level) {
      throw new Error('Invalid clearance level provided');
    }

    super({
      clearanceLevel,
      nodeType: 'subordinate'
    });
    
    this.nodeId = CryptoJS.SHA256(Date.now().toString()).toString();
    this.messages = [];
    this.config = { clearanceLevel }; // Ensure config is initialized
    this.firmwareManager = new FirmwareManager(this);
  }

  async init() {
    try {
      await super.initialize();
      return this;
    } catch (error) {
      throw new Error(`Failed to initialize node: ${error.message}`);
    }
  }

  async connectToPeer(peerInfo) {
    if (!peerInfo?.multiaddr) {
      throw new Error('Invalid peer info: missing multiaddr');
    }

    try {
      await this.dial(peerInfo.multiaddr);
      console.log(`Connected to peer: ${peerInfo.peerId}`);
    } catch (error) {
      throw new Error(`Failed to connect to peer: ${error.message}`);
    }
  }

  async sendSecureMessage(targetNodeId, message, permission) {
    if (!targetNodeId || !message) {
      throw new Error('Invalid parameters: targetNodeId and message are required');
    }

    if (!this.hasPermission(permission)) {
      throw new Error('Insufficient permissions');
    }

    const encryptedMessage = {
      sender: this.nodeId,
      content: CryptoJS.AES.encrypt(message, this.config.clearanceLevel.toString()).toString(),
      timestamp: Date.now(),
      permission
    };

    try {
      const { stream } = await this.node.dialProtocol(targetNodeId, '/secure/1.0.0');
      await this.protocols.sendMessage(stream, encryptedMessage);
    } catch (error) {
      throw new Error(`Failed to send secure message: ${error.message}`);
    }
  }

  hasPermission(permission) {
    return this.config.clearanceLevel?.permissions?.includes(permission) || false;
  }

  async checkForFirmwareUpdates() {
    if (!this.firmwareManager) {
      throw new Error('Firmware manager not initialized');
    }
    return await this.firmwareManager.checkForUpdates();
  }

  async updateFirmware() {
    if (!this.firmwareManager) {
      throw new Error('Firmware manager not initialized');
    }
    return await this.firmwareManager.performUpdate();
  }

  getFirmwareVersion() {
    if (!this.firmwareManager) {
      throw new Error('Firmware manager not initialized');
    }
    return this.firmwareManager.currentVersion;
  }

  getFirmwareUpdateHistory() {
    if (!this.firmwareManager) {
      throw new Error('Firmware manager not initialized');
    }
    return this.firmwareManager.getUpdateHistory();
  }
}

export default SecureNode;