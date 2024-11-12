import NetworkNode from '../core/NetworkNode.js';
import { ClearanceLevel } from './ClearanceLevel.js';
import CryptoJS from 'crypto-js';

class MasterNode extends NetworkNode {
  constructor() {
    super({
      clearanceLevel: ClearanceLevel.MASTER,
      nodeType: 'master'
    });
    
    this.identifier = ClearanceLevel.MASTER.identifier;
    this.signature = this.generateSignature();
    this.emergencyProtocols = new Set();
    this.subordinateNodes = new Map();
  }

  generateSignature() {
    const identifierString = Object.values(this.identifier).join('_');
    return CryptoJS.SHA256(identifierString).toString();
  }

  async initialize() {
    await super.initialize();
    this.startHeartbeat();
    this.setupKillswitch();
    return this;
  }

  setupKillswitch() {
    this.killswitch = {
      active: true,
      signature: this.signature,
      lastVerified: Date.now()
    };

    setInterval(() => this.verifyKillswitch(), 5000);
  }

  verifyKillswitch() {
    if (!this.killswitch.active || 
        this.killswitch.signature !== this.signature ||
        Date.now() - this.killswitch.lastVerified > 10000) {
      this.initiateNetworkShutdown();
    }
  }

  async initiateNetworkShutdown() {
    console.log('⚠️ MASTER NODE KILLSWITCH ACTIVATED');
    
    // Notify all subordinate nodes
    for (const [nodeId, node] of this.subordinateNodes) {
      try {
        const { stream } = await this.node.dialProtocol(nodeId, '/emergency/1.0.0');
        await this.protocols.sendMessage(stream, {
          type: 'NETWORK_SHUTDOWN',
          signature: this.signature,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error(`Failed to notify node ${nodeId} of shutdown`);
      }
    }

    // Shutdown master node
    await this.shutdown();
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.broadcastHeartbeat();
    }, 3000);
  }

  async broadcastHeartbeat() {
    const heartbeat = {
      type: 'MASTER_HEARTBEAT',
      signature: this.signature,
      timestamp: Date.now()
    };

    for (const [nodeId] of this.subordinateNodes) {
      try {
        const { stream } = await this.node.dialProtocol(nodeId, '/heartbeat/1.0.0');
        await this.protocols.sendMessage(stream, heartbeat);
      } catch (error) {
        console.error(`Failed to send heartbeat to ${nodeId}`);
      }
    }
  }

  registerSubordinateNode(nodeId, clearanceLevel) {
    this.subordinateNodes.set(nodeId, { clearanceLevel, lastSeen: Date.now() });
  }

  removeSubordinateNode(nodeId) {
    this.subordinateNodes.delete(nodeId);
  }
}

export default MasterNode;