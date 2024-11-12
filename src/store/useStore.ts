import { create } from 'zustand';
import type { NodeInfo, Message } from '../types/network';

interface NetworkStore {
  nodes: Map<string, NodeInfo>;
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  addNode: (node: NodeInfo) => void;
  removeNode: (nodeId: string) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useStore = create<NetworkStore>((set) => ({
  nodes: new Map(),
  messages: [],
  isLoading: false,
  error: null,
  addNode: (node) =>
    set((state) => ({
      nodes: new Map(state.nodes).set(node.id, node),
    })),
  removeNode: (nodeId) =>
    set((state) => {
      const newNodes = new Map(state.nodes);
      newNodes.delete(nodeId);
      return { nodes: newNodes };
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));