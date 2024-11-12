import MasterNode from './security/MasterNode.js';
import SecureNode from './node.js';
import { ClearanceLevel } from './security/ClearanceLevel.js';

async function initializeNetwork() {
  try {
    // Initialize Master Node (KingJu1c3)
    console.log('🔐 Initializing Master Node (KingJu1c3)...');
    const masterNode = new MasterNode();
    await masterNode.initialize();

    // Initialize subordinate nodes with proper ClearanceLevel objects
    console.log('📡 Creating subordinate nodes...');
    const nodes = await Promise.all([
      new SecureNode(ClearanceLevel.TOP_SECRET).init(),
      new SecureNode(ClearanceLevel.SECRET).init(),
      new SecureNode(ClearanceLevel.CONFIDENTIAL).init()
    ]);

    // Register nodes with master
    console.log('🔗 Registering nodes with Master...');
    for (const node of nodes) {
      if (!node?.nodeId) {
        throw new Error('Invalid node: missing nodeId');
      }
      masterNode.registerSubordinateNode(node.nodeId, node.config.clearanceLevel);
      await node.connectToPeer({
        multiaddr: masterNode.getMultiaddrs()[0],
        clearanceLevel: ClearanceLevel.MASTER.level,
        peerId: masterNode.peerId
      });
    }

    // Test network communication
    console.log('🔒 Testing secure network communication...');
    const [topSecret, secret, confidential] = nodes;

    try {
      await topSecret.sendSecureMessage(
        secret.nodeId,
        "Encrypted top secret communication",
        'READ_ALL'
      );
    } catch (error) {
      console.error('Communication test failed:', error.message);
    }

    // Monitor network status
    console.log('\n📊 Network Status:');
    const statusInterval = setInterval(() => {
      if (!masterNode.isActive) {
        clearInterval(statusInterval);
        return;
      }
      console.log(`Active Nodes: ${masterNode.subordinateNodes.size + 1}`);
      console.log(`Master Node Status: ${masterNode.isActive ? 'ONLINE' : 'OFFLINE'}`);
    }, 5000);

    // Test killswitch after 30 seconds
    setTimeout(() => {
      console.log('\n⚠️ Testing Master Node Killswitch...');
      masterNode.initiateNetworkShutdown();
      clearInterval(statusInterval);
    }, 30000);

  } catch (error) {
    console.error('❌ Network initialization failed:', error);
    throw error;
  }
}

console.log('🌐 Initializing Secure Network Infrastructure...\n');
initializeNetwork().catch(console.error);