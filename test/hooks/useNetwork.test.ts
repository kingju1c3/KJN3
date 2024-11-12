import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetwork } from '../../src/hooks/useNetwork';

describe('useNetwork', () => {
  it('initializes with empty nodes and messages', () => {
    const { result } = renderHook(() => useNetwork());
    
    expect(result.current.nodes.size).toBe(0);
    expect(result.current.messages.length).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('can add a message', async () => {
    const { result } = renderHook(() => useNetwork());
    
    const message = {
      content: 'Test message',
      sender: 'test-node',
      priority: 'high' as const
    };

    await act(async () => {
      await result.current.sendMessage(message);
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].content).toBe('Test message');
  });
});