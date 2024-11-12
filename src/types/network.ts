export interface NodeInfo {
  id: string;
  status: 'active' | 'idle' | 'offline';
  clearanceLevel: string;
  lastSeen: Date;
  metrics?: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  read?: boolean;
}

export interface NetworkMetrics {
  activeNodes: number;
  throughput: {
    current: number;
    history: MetricPoint[];
  };
  latency: {
    current: number;
    history: MetricPoint[];
  };
  reliability: {
    current: number;
    history: MetricPoint[];
  };
}

interface MetricPoint {
  timestamp: string;
  value: number;
}