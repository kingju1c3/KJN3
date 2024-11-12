import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NetworkView from '../../src/components/NetworkView';
import { BrowserRouter } from 'react-router-dom';

describe('NetworkView', () => {
  it('renders the network nodes table', () => {
    render(
      <BrowserRouter>
        <NetworkView />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Network Nodes')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays table headers correctly', () => {
    render(
      <BrowserRouter>
        <NetworkView />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Node ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Clearance')).toBeInTheDocument();
    expect(screen.getByText('Last Seen')).toBeInTheDocument();
  });
});