'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Network } from 'vis-network/peer';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Camera,
  Atom,
  Lock,
  Unlock,
  RotateCcw,
  Tag,
} from 'lucide-react';
import {
  Character,
  Relationship,
  RELATIONSHIP_COLORS,
  RELATIONSHIP_LABELS,
  RELATIONSHIP_LABELS_SHORT,
  RELATIONSHIP_EMOJIS,
  STRENGTH_WIDTH,
  Node,
  Edge,
} from '@/types';
import { RelationshipIcon } from './RelationshipIcon';

interface GraphViewProps {
  characters: Character[];
  relationships: Relationship[];
  positions?: Record<string, { x: number; y: number }>;
  showEdgeLabels?: boolean;
  onSelectNode?: (characterId: string) => void;
  onSelectEdge?: (relationshipId: string) => void;
  onSavePositions?: (positions: Record<string, { x: number; y: number }>) => void;
  onClearPositions?: () => void;
}

export default function GraphView({
  characters,
  relationships,
  positions,
  showEdgeLabels = true,
  onSelectNode,
  onSelectEdge,
  onSavePositions,
  onClearPositions,
}: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [showLabels, setShowLabels] = useState(showEdgeLabels);

  const handleScreenshot = useCallback(() => {
    if (!containerRef.current) return;
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `narrativeweb-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes: Node[] = characters.map((char) => {
      const pos = positions?.[char.id];
      return {
        id: char.id,
        label: char.group ? `${char.name}\n[${char.group}]` : char.name,
        title: char.description
          ? `${char.name}${char.group ? ` (${char.group})` : ''}\n${char.description}`
          : char.name,
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
          size: 14,
          face: 'var(--font-outfit)',
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 10,
          x: 0,
          y: 4,
        },
        ...(pos ? { x: pos.x, y: pos.y } : {}),
      };
    });

    const edges: Edge[] = relationships.map((rel) => {
      const baseLabel = rel.label || RELATIONSHIP_LABELS_SHORT[rel.type];
      const edgeLabel = showLabels
        ? `       ${baseLabel}` // Add spaces to make room for the icon
        : undefined;

      return {
        id: rel.id,
        from: rel.sourceId,
        to: rel.targetId,
        label: edgeLabel,
        color: {
          color: RELATIONSHIP_COLORS[rel.type],
          opacity: 0.6,
          highlight: RELATIONSHIP_COLORS[rel.type],
        },
        width: STRENGTH_WIDTH[rel.strength],
        title: `${RELATIONSHIP_LABELS[rel.type]} (${rel.strength === 'weak' ? '약함' : rel.strength === 'medium' ? '보통' : '강함'})${rel.description ? '\n' + rel.description : ''}`,
        font: showLabels
          ? {
              size: 11,
              color: RELATIONSHIP_COLORS[rel.type],
              face: 'var(--font-inter)',
              strokeWidth: 4,
              strokeColor: '#0f1115',
              align: 'middle',
            }
          : undefined,
        arrows:
          rel.directional === false
            ? {}
            : { to: { enabled: true, scaleFactor: 0.8, type: 'arrow' as const } },
      };
    });

    const options = {
      physics: {
        enabled: physicsEnabled,
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
        tooltipDelay: 200,
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
        font: {
          face: 'var(--font-outfit)',
        },
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          roundness: 0.5,
        },
        arrows: {
          to: { enabled: true, scaleFactor: 0.8, type: 'arrow' as const },
        },
      },
    };

    const data = { nodes, edges };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(containerRef.current, data, options);

    const network = networkRef.current;

    // Save positions on drag end
    if (onSavePositions) {
      network.on('dragEnd', (params: any) => {
        if (params.nodes.length > 0) {
          const positions = network.getPositions(params.nodes);
          onSavePositions(positions);
        }
      });
    }

    if (onSelectNode) {
      network.on('click', (event: any) => {
        if (event.nodes.length > 0) {
          onSelectNode(event.nodes[0]);
        } else {
          onSelectNode('');
        }
      });
    }

    if (onSelectEdge) {
      network.on('click', (event: any) => {
        if (event.edges.length > 0 && event.nodes.length === 0) {
          onSelectEdge(event.edges[0]);
        }
      });
    }

    // Pre-generate images for each relationship type
    const icons: Record<string, HTMLImageElement> = {};
    const types = Array.from(new Set(relationships.map(r => r.type)));
    
    types.forEach(type => {
      const svgString = renderToStaticMarkup(
        <RelationshipIcon type={type} color={RELATIONSHIP_COLORS[type]} size={16} />
      );
      const img = new Image();
      img.onload = () => {
        if (networkRef.current) {
          networkRef.current.redraw();
        }
      };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
      icons[type] = img;
    });

    // Custom drawing for edge icons
    if (showLabels) {
      network.on('afterDrawing', (ctx: CanvasRenderingContext2D) => {
        relationships.forEach(rel => {
          const edgeId = rel.id;
          const edgeObj = (network as any).body.edges[edgeId];
          if (!edgeObj || !edgeObj.labelModule || !edgeObj.labelModule.size) return;

          let lx = edgeObj.labelModule?.x;
          let ly = edgeObj.labelModule?.y;
          
          if (lx === undefined || ly === undefined) {
            if (edgeObj.edgeType && typeof edgeObj.edgeType.getPoint === 'function') {
              const pt = edgeObj.edgeType.getPoint(0.5);
              lx = pt.x;
              ly = pt.y;
            }
          }

          const labelWidth = edgeObj.labelModule?.size?.width;

          if (lx !== undefined && ly !== undefined && labelWidth !== undefined) {
            const img = icons[rel.type];
            if (img && img.complete) {
              const size = 16;
              // Add a white background to the icon to make it legible and clean
              ctx.beginPath();
              ctx.arc(lx - labelWidth / 2 + size / 2, ly, size / 2 + 2, 0, 2 * Math.PI);
              ctx.fillStyle = '#0f1115'; // Match background
              ctx.fill();
              
              ctx.drawImage(img, lx - labelWidth / 2, ly - size / 2, size, size);
            }
          }
        });
      });
    }

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [characters, relationships, positions, showLabels, physicsEnabled, onSelectNode, onSelectEdge, onSavePositions]);

  const handleZoomIn = () => {
    const network = networkRef.current;
    if (!network) return;
    const scale = network.getScale();
    network.moveTo({ scale: scale * 1.3, animation: true });
  };

  const handleZoomOut = () => {
    const network = networkRef.current;
    if (!network) return;
    const scale = network.getScale();
    network.moveTo({ scale: scale / 1.3, animation: true });
  };

  const handleFit = () => {
    networkRef.current?.fit({ animation: true });
  };

  const handleTogglePhysics = () => {
    setPhysicsEnabled((prev) => !prev);
  };

  const handleResetPositions = () => {
    if (onClearPositions) {
      onClearPositions();
    }
  };

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
        <h3 className="text-xl font-display font-bold text-white mb-2">
          NarrativeWeb 에 오신 것을 환영합니다
        </h3>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium italic">
          왼쪽 패널에서 캐릭터를 추가하여
          <br />
          이야기의 인물 관계도를 완성해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '100%' }} />

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
          title="확대"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
          title="축소"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFit}
          className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
          title="전체 보기"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-white/10 my-1" />
        <button
          onClick={() => setShowLabels((prev) => !prev)}
          className={`p-2.5 backdrop-blur-md border rounded-xl transition-all shadow-lg ${
            showLabels
              ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
              : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
          }`}
          title={showLabels ? '라벨 숨기기' : '라벨 보이기'}
        >
          <Tag className="w-4 h-4" />
        </button>
        <button
          onClick={handleTogglePhysics}
          className={`p-2.5 backdrop-blur-md border rounded-xl transition-all shadow-lg ${
            physicsEnabled
              ? 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
              : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
          }`}
          title={physicsEnabled ? '물리엔진 활성' : '물리엔진 비활성 (고정)'}
        >
          {physicsEnabled ? <Atom className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </button>
        <button
          onClick={handleResetPositions}
          className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
          title="위치 초기화"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-white/10 my-1" />
        <button
          onClick={handleScreenshot}
          className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
          title="이미지 저장"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Relationship Type Legend */}
      {relationships.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg z-10">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">관계 유형</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Array.from(new Set(relationships.map((r) => r.type))).map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: RELATIONSHIP_COLORS[type] }}
                />
                <RelationshipIcon type={type} className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium">
                  {RELATIONSHIP_LABELS[type]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
