'use client';

import { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';
import {
  Character,
  Relationship,
  RELATIONSHIP_COLORS,
  STRENGTH_WIDTH,
  Node,
  Edge,
} from '@/types';

interface GraphViewProps {
  characters: Character[];
  relationships: Relationship[];
  onSelectNode?: (characterId: string) => void;
  onSelectEdge?: (relationshipId: string) => void;
}

export default function GraphView({
  characters,
  relationships,
  onSelectNode,
  onSelectEdge,
}: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes: Node[] = characters.map((char) => ({
      id: char.id,
      label: char.name,
      title: char.description || char.name,
      color: {
        background: char.color,
        border: '#ffffff',
      },
      font: {
        color: '#ffffff',
        size: 14,
      },
    }));

    const edges: Edge[] = relationships.map((rel) => ({
      id: rel.id,
      from: rel.sourceId,
      to: rel.targetId,
      color: {
        color: RELATIONSHIP_COLORS[rel.type],
        opacity: 0.7,
      },
      width: STRENGTH_WIDTH[rel.strength],
      title: `${rel.type} (${rel.strength})${rel.description ? ': ' + rel.description : ''}`,
    }));

    const options = {
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200,
          fit: true,
        },
        barnesHut: {
          gravitationalConstant: -12000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
        },
      },
      interaction: {
        navigationButtons: true,
        keyboard: true,
        zoomView: true,
        dragView: true,
      },
      nodes: {
        shape: 'box' as const,
        margin: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
        widthConstraint: {
          maximum: 200,
        },
        scaling: {
          min: 80,
          max: 150,
          label: {
            enabled: true,
            min: 16,
            max: 32,
          },
        },
        font: {
          size: 16,
          face: 'Segoe UI, sans-serif',
          color: '#ffffff',
          bold: {
            size: 18,
          },
          multi: false,
        },
        borderWidth: 3,
        borderWidthSelected: 4,
      },
      edges: {
        width: 2,
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5,
        },
        arrows: {
          from: { enabled: false, scaleFactor: 0.5 },
          to: { enabled: true, scaleFactor: 0.5 },
          middle: { enabled: false },
        },
        arrowStrikethrough: false,
        color: {
          opacity: 0.8,
        },
      },
    };

    const data = { nodes, edges };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(containerRef.current, data, options);

    const network = networkRef.current;

    if (onSelectNode) {
      network.on('click', (event) => {
        if (event.nodes.length > 0) {
          onSelectNode(event.nodes[0]);
        }
      });
    }

    if (onSelectEdge) {
      network.on('click', (event) => {
        if (event.edges.length > 0) {
          onSelectEdge(event.edges[0]);
        }
      });
    }

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [characters, relationships, onSelectNode, onSelectEdge]);

  if (characters.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800/30 rounded-lg border-2 border-dashed border-purple-500/30">
        <div className="text-center text-slate-400">
          <p className="text-lg font-semibold">👥 캐릭터를 추가해주세요</p>
          <p className="text-sm mt-2">관계도가 여기에 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-purple-500/20"
      style={{ minHeight: '100%' }}
    />
  );
}
