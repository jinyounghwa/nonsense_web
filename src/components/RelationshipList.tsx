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
      <h3 className="text-lg font-semibold text-gray-800">관계 목록</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {relationships.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">관계가 없습니다</p>
        ) : (
          relationships.map((rel) => (
            <div
              key={rel.id}
              className="flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: RELATIONSHIP_COLORS[rel.type] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {getCharacterName(rel.sourceId)} ↔ {getCharacterName(rel.targetId)}
                </p>
                <div className="flex gap-2 text-xs text-gray-600">
                  <span
                    className="px-2 py-0.5 rounded bg-white"
                    style={{
                      borderLeft: `3px solid ${RELATIONSHIP_COLORS[rel.type]}`,
                    }}
                  >
                    {RELATIONSHIP_LABELS[rel.type]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white">
                    {rel.strength === 'weak' ? '약함' : rel.strength === 'medium' ? '중간' : '강함'}
                  </span>
                </div>
                {rel.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {rel.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onEdit(rel)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    if (confirm(`이 관계를 삭제하시겠습니까?`)) {
                      onDelete(rel.id);
                    }
                  }}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
