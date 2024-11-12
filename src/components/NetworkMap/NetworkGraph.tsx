import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNetwork } from '@/hooks/useNetwork';
import type { NodeInfo } from '@/types/network';

interface GraphNode {
  id: string;
  status: string;
  clearanceLevel: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function NetworkGraph() {
  const { nodes } = useNetwork();
  const graphRef = useRef<any>();

  const graphData = useMemo<GraphData>(() => {
    const graphNodes = Array.from(nodes.values()).map((node: NodeInfo) => ({
      id: node.id,
      status: node.status,
      clearanceLevel: node.clearanceLevel
    }));

    const links = graphNodes.map((node, idx) => ({
      source: node.id,
      target: graphNodes[(idx + 1) % graphNodes.length].id
    }));

    return { nodes: graphNodes, links };
  }, [nodes]);

  const getNodeColor = useCallback((node: GraphNode) => {
    switch (node.status) {
      case 'active': return '#48BB78';
      case 'idle': return '#ECC94B';
      default: return '#F56565';
    }
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-400);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  return (
    <Box 
      h="600px" 
      border="1px" 
      borderColor="gray.200" 
      borderRadius="md"
      position="relative"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeColor={getNodeColor}
        nodeLabel={node => `${node.id} (${node.clearanceLevel})`}
        linkColor={() => '#CBD5E0'}
        width={800}
        height={600}
        enableNodeDrag={false}
        enableZoom={true}
        onNodeClick={(node) => {
          console.log('Node clicked:', node);
        }}
      />
    </Box>
  );
}