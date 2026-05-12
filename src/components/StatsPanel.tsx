'use client';

import { Character, CharacterGroup, GraphData, RELATIONSHIP_COLORS, RELATIONSHIP_LABELS } from '@/types';
import { BarChart3, Users, Share2, TrendingUp, Award, AlertTriangle, PieChart } from 'lucide-react';

interface StatsPanelProps {
  graphData: GraphData;
}

export default function StatsPanel({ graphData }: StatsPanelProps) {
  const { characters, relationships, groups } = graphData;

  // Calculations
  const typeCounts: Record<string, number> = {};
  const strengthCounts: Record<string, number> = {};
  const groupCounts: Record<string, number> = {};
  const connectionCounts: Record<string, number> = {};

  relationships.forEach((rel) => {
    typeCounts[rel.type] = (typeCounts[rel.type] || 0) + 1;
    strengthCounts[rel.strength] = (strengthCounts[rel.strength] || 0) + 1;
    connectionCounts[rel.sourceId] = (connectionCounts[rel.sourceId] || 0) + 1;
    connectionCounts[rel.targetId] = (connectionCounts[rel.targetId] || 0) + 1;
  });

  characters.forEach((c) => {
    const g = c.group || '미분류';
    groupCounts[g] = (groupCounts[g] || 0) + 1;
  });

  // Most connected character
  const maxConnections = Math.max(...Object.values(connectionCounts), 0);
  const mostConnected = Object.entries(connectionCounts)
    .filter(([, count]) => count === maxConnections && count > 0)
    .map(([id]) => characters.find((c) => c.id === id))
    .filter(Boolean);

  // Isolated characters (no relationships)
  const isolated = characters.filter((c) => !connectionCounts[c.id]);

  // Directional stats
  const directionalCount = relationships.filter((r) => r.directional !== false).length;
  const bidirectionalCount = relationships.filter((r) => r.directional === false).length;

  const totalTypes = Object.keys(typeCounts).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">인물</span>
          </div>
          <p className="text-2xl font-display font-bold text-white">{characters.length}</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">관계</span>
          </div>
          <p className="text-2xl font-display font-bold text-white">{relationships.length}</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">관계 종류</span>
          </div>
          <p className="text-2xl font-display font-bold text-white">{totalTypes}</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">그룹</span>
          </div>
          <p className="text-2xl font-display font-bold text-white">{groups?.length || 0}</p>
        </div>
      </div>

      {/* Relationship Type Breakdown */}
      {Object.keys(typeCounts).length > 0 && (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            관계 유형 분포
          </h3>
          <div className="space-y-2">
            {Object.entries(typeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => {
                const pct = Math.round((count / relationships.length) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{RELATIONSHIP_LABELS[type as keyof typeof RELATIONSHIP_LABELS]}</span>
                      <span className="text-[11px] text-slate-500 font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: RELATIONSHIP_COLORS[type as keyof typeof RELATIONSHIP_COLORS],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Strength Breakdown */}
      {Object.keys(strengthCounts).length > 0 && (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            유대 강도 분포
          </h3>
          <div className="flex gap-3">
            {[
              { key: 'weak', label: '약함', color: '#6b7280' },
              { key: 'medium', label: '보통', color: '#3b82f6' },
              { key: 'strong', label: '강함', color: '#ef4444' },
            ].map(({ key, label, color }) => (
              <div key={key} className="flex-1 text-center p-2 bg-white/[0.03] rounded-lg">
                <p className="text-lg font-display font-bold" style={{ color }}>
                  {strengthCounts[key] || 0}
                </p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direction Stats */}
      {relationships.length > 0 && (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            방향성 통계
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 text-center p-2 bg-white/[0.03] rounded-lg">
              <p className="text-lg font-display font-bold text-indigo-400">{directionalCount}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase">단방향</p>
            </div>
            <div className="flex-1 text-center p-2 bg-white/[0.03] rounded-lg">
              <p className="text-lg font-display font-bold text-purple-400">{bidirectionalCount}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase">양방향</p>
            </div>
          </div>
        </div>
      )}

      {/* Most Connected */}
      {mostConnected.length > 0 && (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            최다 연결 인물
          </h3>
          <div className="space-y-2">
            {mostConnected.slice(0, 3).map((char) =>
              char ? (
                <div key={char.id} className="flex items-center gap-3 p-2 bg-white/[0.03] rounded-lg">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: char.color }}
                  >
                    {char.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{char.name}</p>
                    {char.group && (
                      <p className="text-[9px] text-slate-500">{char.group}</p>
                    )}
                  </div>
                  <span className="text-sm font-display font-bold text-amber-400">{maxConnections}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Isolated Characters Warning */}
      {isolated.length > 0 && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <h3 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            관계가 없는 인물 ({isolated.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {isolated.map((char) => (
              <div
                key={char.id}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg"
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold text-white"
                  style={{ backgroundColor: char.color }}
                >
                  {char.name.charAt(0)}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{char.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Distribution */}
      {Object.keys(groupCounts).length > 0 && characters.length > 0 && (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            그룹 분포
          </h3>
          <div className="space-y-2">
            {Object.entries(groupCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([group, count]) => {
                const pct = Math.round((count / characters.length) * 100);
                return (
                  <div key={group} className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium min-w-[60px] truncate">{group}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500/60 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
