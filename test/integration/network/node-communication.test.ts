import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SecureNode } from '../../../src/node/SecureNode';
import { ClearanceLevel } from '../../../src/security/ClearanceLevel';

describe('Node Communication', () => {
  let nodeA: SecureNode;
  let nodeB: SecureNode;

  beforeEach(async () => {
    nodeA = new SecureNode(ClearanceLevel.TOP_SECRET);
    nodeB = new SecureNode(ClearanceLevel.SECRET);
    
    await nodeA.init();
    await nodeB.init();
  });

  afterEach(async () => {
    await nodeA.shutdown();
    await nodeB.shutdown();
  });

  it('establishes secure connection between nodes', async () => {
    const connected = await nodeA.connectToPeer({
      multiaddr: nodeB.getMultiaddrs()[0],
      peerId: nodeB.peerId
    });
    
    expect(connected).toBeTruthy();
  });

  it('sends encrypted message between nodes', async () => {
    const message = 'Test secure message';
    
    const result = await nodeA.sendSecureMessage(
      nodeB.nodeId,
      message,
      'READ_ALL'
    );
    
    expect(result.status).toBe('received');
  });
});