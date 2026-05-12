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
        border: 'rgba(255, 255, 255, 0.2)',
        highlight: {
          background: char.color,
          border: '#ffffff',
        },
      },
      font: {
        color: '#ffffff',
        size: 16,
        face: 'var(--font-outfit)',
      },
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.5)',
        size: 10,
        x: 0,
        y: 4,
      },
    }));

    const edges: Edge[] = relationships.map((rel) => ({
      id: rel.id,
      from: rel.sourceId,
      to: rel.targetId,
      color: {
        color: RELATIONSHIP_COLORS[rel.type],
        opacity: 0.6,
        highlight: RELATIONSHIP_COLORS[rel.type],
      },
      width: STRENGTH_WIDTH[rel.strength],
      title: `${rel.type} (${rel.strength})${rel.description ? ': ' + rel.description : ''}`,
      font: {
        size: 10,
        color: '#94a3b8',
        face: 'var(--font-inter)',
        strokeWidth: 0,
      },
    }));

    const options = {
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200,
          fit: true,
        },
        barnesHut: {
          gravitationalConstant: -15000,
          centralGravity: 0.4,
          springLength: 250,
          springConstant: 0.04,
          damping: 0.09,
        },
      },
      interaction: {
        navigationButtons: false,
        keyboard: true,
        zoomView: true,
        dragView: true,
        hover: true,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
      },
      nodes: {
        shape: 'box' as const,
        margin: {
          top: 12,
          bottom: 12,
          left: 18,
          right: 18,
        },
        borderWidth: 2,
        borderRadius: 12,
        font: {
          face: 'var(--font-outfit)',
          weight: '700',
        },
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          roundness: 0.5,
        },
        arrows: {
          to: { enabled: true, scaleFactor: 0.8, type: 'arrow' },
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
        } else {
          onSelectNode('');
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
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0f1115]">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-indigo-500/5 rounded-full animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Share2 className="w-12 h-12 text-indigo-500/40" />
          </div>
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">NarrativeWeb 에 오신 것을 환영합니다</h3>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium italic">
          왼쪽 패널에서 캐릭터를 추가하여<br/>이야기의 인물 관계도를 완성해보세요.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
}
