import { networkAPI } from '@/api/network';
import { cache } from '@/utils/cache';
import type { NodeInfo, NetworkMetrics } from '@/types/network';

const CACHE_TTL = 30000; // 30 seconds

export class NetworkService {
  private static instance: NetworkService;

  private constructor() {}

  static getInstance(): NetworkService {
    if (!this.instance) {
      this.instance = new NetworkService();
    }
    return this.instance;
  }

  async getNodeStatus(nodeId: string): Promise<NodeInfo> {
    const cacheKey = `node-status-${nodeId}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const status = await networkAPI.getNodeStatus(nodeId);
    cache.set(cacheKey, status, CACHE_TTL);
    return status;
  }

  async batchGetNodeStatus(nodeIds: string[]): Promise<Map<string, NodeInfo>> {
    const results = await Promise.all(
      nodeIds.map(id => this.getNodeStatus(id))
    );
    
    return new Map(
      results.map((status, index) => [nodeIds[index], status])
    );
  }

  async getNetworkMetrics(): Promise<NetworkMetrics> {
    const cacheKey = 'network-metrics';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const metrics = await networkAPI.getNetworkMetrics();
    cache.set(cacheKey, metrics, CACHE_TTL);
    return metrics;
  }
}