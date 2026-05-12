'use client';

import { Character, Relationship, RELATIONSHIP_COLORS, RELATIONSHIP_LABELS } from '@/types';

interface RelationshipListProps {
  relationships: Relationship[];
  characters: Character[];
  onDelete: (id: string) => void;
  onEdit: (relationship: Relationship) => void;
}

export default function RelationshipList({
  relationships,
  characters,
  onDelete,
  onEdit,
}: RelationshipListProps) {
  const getCharacterName = (id: string) => {
    return characters.find((c) => c.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-purple-300 uppercase tracking-widest">관계 목록</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
        {relationships.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">관계가 없습니다</p>
        ) : (
          relationships.map((rel) => (
            <div
              key={rel.id}
              className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/40 border border-slate-600/50 hover:bg-slate-700/60 hover:border-purple-500/30 transition-all"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: RELATIONSHIP_COLORS[rel.type] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {getCharacterName(rel.sourceId)} ↔ {getCharacterName(rel.targetId)}
                </p>
                <div className="flex gap-1 text-xs mt-1 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full bg-slate-600/50 text-white"
                    style={{
                      borderLeft: `2px solid ${RELATIONSHIP_COLORS[rel.type]}`,
                    }}
                  >
                    {RELATIONSHIP_LABELS[rel.type]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-300">
                    {rel.strength === 'weak' ? '약' : rel.strength === 'medium' ? '중' : '강'}
                  </span>
                </div>
                {rel.description && (
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {rel.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onEdit(rel)}
                  className="text-xs bg-blue-600/70 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                  title="수정"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm('이 관계를 삭제하시겠습니까?')) {
                      onDelete(rel.id);
                    }
                  }}
                  className="text-xs bg-red-600/70 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
