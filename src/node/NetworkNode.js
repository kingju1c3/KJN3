import { createLibp2p } from 'libp2p';
import { TCP } from '@libp2p/tcp';
import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import { NetworkProtocols } from './NetworkProtocols.js';

export class NetworkNode {
  constructor(config) {
    this.config = config;
    this.protocols = new NetworkProtocols(this);
    this.isActive = false;
  }

  async initialize() {
    this.node = await createLibp2p({
      addresses: { listen: ['/ip4/0.0.0.0/tcp/0'] },
      transports: [new TCP()],
      streamMuxers: [new Mplex()],
      connectionEncryption: [new Noise()]
    });

    await this.node.start();
    this.isActive = true;
    this.peerId = this.node.peerId.toString();
    
    return this;
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

  async dial(peer) {
    return this.node.dial(peer);
  }

  handle(protocol, handler) {
    this.node.handle(protocol, handler);
  }
}