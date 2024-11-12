import { createLibp2p } from 'libp2p';
import { TCP } from '@libp2p/tcp';
import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import CryptoJS from 'crypto-js';
import { FirmwareManager } from '../firmware/FirmwareManager';
import { NetworkProtocols } from './NetworkProtocols';
import type { ClearanceLevel } from '../types/security';

export class Node {
  protected config: { clearanceLevel: ClearanceLevel; nodeType: string };
  protected nodeId: string;
  protected messages: any[];
  protected firmwareManager: FirmwareManager;
  protected protocols: NetworkProtocols;
  protected isActive: boolean;
  protected lastActivity: number;
  protected node: any;
  protected peerId: string;

  constructor(clearanceLevel: ClearanceLevel, nodeType: string = 'subordinate') {
    if (!clearanceLevel?.level) {
      throw new Error('Invalid clearance level provided');
    }

    this.config = { clearanceLevel, nodeType };
    this.nodeId = this.generateNodeId();
    this.messages = [];
    this.firmwareManager = new FirmwareManager(this);
    this.protocols = new NetworkProtocols(this);
    this.isActive = false;
    this.lastActivity = Date.now();
  }

  protected generateNodeId(): string {
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

  protected startActivityMonitor() {
    setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivity;
      if (inactiveTime > 300000) { // 5 minutes
        console.warn(`Node ${this.nodeId} has been inactive for ${Math.floor(inactiveTime / 1000)}s`);
      }
    }, 60000);
  }

  async shutdown() {
    if (this.isActive) {
      await this.node.stop();
      this.isActive = false;
    }
  }

  getMultiaddrs() {
    return this.node.getMultiaddrs();
  }

  async dial(peer: any) {
    return this.node.dial(peer);
  }

  handle(protocol: string, handler: Function) {
    this.node.handle(protocol, handler);
  }

  getFirmwareVersion() {
    return this.firmwareManager.currentVersion;
  }

  hasPermission(permission: string): boolean {
    return this.config.clearanceLevel?.permissions?.includes(permission) || false;
  }

  getNodeId(): string {
    return this.nodeId;
  }

  getPeerId(): string {
    return this.peerId;
  }

  isOperational(): boolean {
    return this.isActive;
  }
}