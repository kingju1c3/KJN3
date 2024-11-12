import { useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { NetworkService } from '@/services/network';
import type { Message } from '@/types/network';

const networkService = NetworkService.getInstance();

export function useNetwork() {
  const { 
    nodes, 
    messages, 
    isLoading, 
    error, 
    addNode, 
    addMessage, 
    setLoading, 
    setError 
  } = useStore();

  const fetchNodeStatus = useCallback(async (nodeId: string) => {
    try {
      setLoading(true);
      const status = await networkService.getNodeStatus(nodeId);
      addNode(status);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch node status'));
    } finally {
      setLoading(false);
    }
  }, [addNode, setLoading, setError]);

  const batchFetchNodeStatus = useCallback(async (nodeIds: string[]) => {
    try {
      setLoading(true);
      const statuses = await networkService.batchGetNodeStatus(nodeIds);
      statuses.forEach(status => addNode(status));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch node statuses'));
    } finally {
      setLoading(false);
    }
  }, [addNode, setLoading, setError]);

  const sendMessage = useCallback(async (message: Omit<Message, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      const newMessage: Message = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date()
      };
      addMessage(newMessage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading, setError]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.size > 0) {
        batchFetchNodeStatus(Array.from(nodes.keys()));
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [nodes, batchFetchNodeStatus]);

  return {
    nodes,
    messages,
    isLoading,
    error,
    fetchNodeStatus,
    batchFetchNodeStatus,
    sendMessage
  };
}