import { createLibp2p } from 'libp2p';
import { TCP } from '@libp2p/tcp';
import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import CryptoJS from 'crypto-js';
import { FirmwareManager } from '../firmware/FirmwareManager.js';

export class SecureNode {
  constructor(clearanceLevel) {
    if (!clearanceLevel || !clearanceLevel.level) {
      throw new Error('Invalid clearance level provided');
    }

    this.config = {
      clearanceLevel,
      nodeType: 'subordinate'
    };
    
    this.nodeId = this.generateNodeId();
    this.messages = [];
    this.firmwareManager = new FirmwareManager(this);
    this.isActive = false;
    this.lastActivity = Date.now();
  }

  generateNodeId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return CryptoJS.SHA256(`${timestamp}-${random}`).toString();
  }

  async init() {
    try {
      this.node = await createLibp2p({
        addresses: { listen: ['/ip4/0.0.0.0/tcp/0'] },
        transports: [new TCP()],
        streamMuxers: [new Mplex()],
        connectionEncryption: [new Noise()]
      });

      await this.node.start();
      this.isActive = true;
      this.peerId = this.node.peerId.toString();
      this.startActivityMonitor();
      return this;
    } catch (error) {
      throw new Error(`Failed to initialize node: ${error.message}`);
    }
  }

  startActivityMonitor() {
    this.activityMonitor = setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivity;
      if (inactiveTime > 300000) { // 5 minutes
        console.warn(`Node ${this.nodeId} has been inactive for ${Math.floor(inactiveTime / 1000)}s`);
      }
    }, 60000);
  }

  async shutdown() {
    if (this.activityMonitor) {
      clearInterval(this.activityMonitor);
    }
    if (this.isActive) {
      await this.node.stop();
      this.isActive = false;
    }
  }

  getMultiaddrs() {
    return this.node.getMultiaddrs();
  }

  getFirmwareVersion() {
    return this.firmwareManager.currentVersion;
  }

  hasPermission(permission) {
    return this.config.clearanceLevel?.permissions?.includes(permission) || false;
  }
}